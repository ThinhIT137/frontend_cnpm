"use client";

import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";

import { renderToString } from "react-dom/server";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faLocationDot,
    faCrosshairs,
    faSearch,
    faRoute,
    faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { MapViewProps } from "@/types/MapViewProps";
import { profileApi } from "@/app/api/profileApi";

// 🔴 IMPORT FORM INSERT MARKER CỦA SẾP VÀO ĐÂY (Nhớ check lại đường dẫn nếu bị lệch thư mục)
import FormInsertMarker from "@/components/common/forms/FormInsertMarker";

const MapView = ({
    locations,
    selectedLocation,
    LocaltionSetView,
    size,
}: MapViewProps) => {
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<L.Map | null>(null);
    const markersLayerRef = useRef<L.LayerGroup | null>(null);
    const routingControlRef = useRef<any>(null);
    const startMarkerRef = useRef<L.Marker | null>(null);
    const startCoordsRef = useRef<[number, number] | null>(null);

    const [addressInput, setAddressInput] = useState("");
    const [startCoords, setStartCoords] = useState<[number, number] | null>(
        null,
    );

    const [showSearch, setShowSearch] = useState(false);
    const [showRoutePanel, setShowRoutePanel] = useState(false);
    const [hasRoute, setHasRoute] = useState(false);

    const [isMapReady, setIsMapReady] = useState(false);
    const [publicMarkers, setPublicMarkers] = useState<any[]>([]);

    // 🔴 THÊM STATE ĐỂ QUẢN LÝ POPUP FORM THÊM MARKER
    const [showAddMarkerForm, setShowAddMarkerForm] = useState(false);
    const [newMarkerCoords, setNewMarkerCoords] = useState<{
        lat: number;
        lng: number;
    } | null>(null);

    // ==============================================================
    // LUỒNG 1: KHỞI TẠO BẢN ĐỒ VÀ BẮT SỰ KIỆN DOUBLE CLICK
    // ==============================================================
    useEffect(() => {
        if (
            typeof window === "undefined" ||
            !mapContainerRef.current ||
            mapInstanceRef.current
        )
            return;

        (window as any).L = L;

        import("leaflet-routing-machine")
            .then(() => {
                const container = mapContainerRef.current;
                if (!container || (container as any)._leaflet_id) return;

                try {
                    (L as any).Routing.Localization =
                        (L as any).Routing.Localization || {};
                    (L as any).Routing.Localization["vi"] = {
                        directions: {
                            N: "hướng Bắc",
                            NE: "hướng Đông Bắc",
                            E: "hướng Đông",
                            SE: "hướng Đông Nam",
                            S: "hướng Nam",
                            SW: "hướng Tây Nam",
                            W: "hướng Tây",
                            NW: "hướng Tây Bắc",
                        },
                        instructions: {
                            Head: "Đi thẳng về {dir}{onto}",
                            Continue: "Tiếp tục{onto}",
                            SlightRight: "Đi hơi chếch sang phải{onto}",
                            Right: "Rẽ phải{onto}",
                            SharpRight: "Rẽ ngoặt sang phải{onto}",
                            SlightLeft: "Đi hơi chếch sang trái{onto}",
                            Left: "Rẽ trái{onto}",
                            SharpLeft: "Rẽ ngoặt sang trái{onto}",
                            Uturn: "Quay đầu xe",
                            TurnAround: "Quay lại",
                            StartAtEndOfStreet: "Bắt đầu tại cuối đường",
                            ReachWaypoint: "Đến trạm dừng",
                            DestinationReached: "Đã đến nơi",
                            EnterRoundabout:
                                "Đi vào vòng xuyến và rẽ ở lối ra thứ {exitStr}",
                            LeaveRoundabout: "Rời khỏi vòng xuyến{onto}",
                            onto: " vào {road}",
                        },
                    };
                } catch (err) {
                    console.log("Setup vietsub lỗi:", err);
                }

                const ggStandard = L.tileLayer(
                    "https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}&hl=vi",
                    { attribution: "© Google Maps" },
                );
                const ggHybrid = L.tileLayer(
                    "https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}&hl=vi",
                    { attribution: "© Google Maps (Lai)" },
                );
                const ggSatellite = L.tileLayer(
                    "https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}&hl=vi",
                    { attribution: "© Google Maps (Vệ tinh)" },
                );

                // 🔴 1. KHỞI TẠO MAP: THÊM doubleClickZoom: false
                mapInstanceRef.current = L.map(container, {
                    zoomSnap: 0.1,
                    zoomDelta: 0.1,
                    layers: [ggStandard],
                    doubleClickZoom: false, // CHẶN ZOOM KHI DOUBLE CLICK
                }).setView(LocaltionSetView || [15.8, 105.8], size || 12);

                L.control
                    .layers({
                        "Bản đồ chuẩn": ggStandard,
                        "Vệ tinh": ggHybrid,
                        Trơn: ggSatellite,
                    })
                    .addTo(mapInstanceRef.current);

                markersLayerRef.current = L.layerGroup().addTo(
                    mapInstanceRef.current,
                );
                setIsMapReady(true);

                // 🔴 2. LẮNG NGHE SỰ KIỆN DOUBLE CLICK TRÊN BẢN ĐỒ
                mapInstanceRef.current.on(
                    "dblclick",
                    (e: L.LeafletMouseEvent) => {
                        const token = localStorage.getItem("accessToken");
                        if (!token) {
                            alert(
                                "Vui lòng đăng nhập để có thể ghim vị trí mới!",
                            );
                            return;
                        }

                        // Lấy tọa độ và bật Form
                        setNewMarkerCoords({
                            lat: e.latlng.lat,
                            lng: e.latlng.lng,
                        });
                        setShowAddMarkerForm(true);
                    },
                );
            })
            .catch((e) => console.error("Lỗi load Routing:", e));

        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
                setIsMapReady(false);
            }
        };
    }, []);

    // ==============================================================
    // LUỒNG 2: GỌI API PUBLIC MARKERS
    // ==============================================================
    const fetchPublicMarkers = async () => {
        try {
            const res = await profileApi.getPublicMarkers();
            if (res && res.success && res.data) {
                setPublicMarkers(res.data);
            }
        } catch (error) {
            console.error("Lỗi lấy Public Markers:", error);
        }
    };

    useEffect(() => {
        fetchPublicMarkers();
    }, []);

    // ==============================================================
    // LUỒNG 3: VẼ MARKER (ĐỎ VÀ VÀNG)
    // ==============================================================
    useEffect(() => {
        const markerGroup = markersLayerRef.current;
        if (!markerGroup || !isMapReady) return;

        markerGroup.clearLayers();

        const destIcon = L.divIcon({
            html: renderToString(
                <FontAwesomeIcon
                    icon={faLocationDot}
                    style={{ color: "#ef4444", fontSize: "32px" }}
                />,
            ),
            className: "",
            iconSize: [32, 32],
            iconAnchor: [16, 32],
            popupAnchor: [0, -32],
        });

        const yellowMarkerIcon = L.divIcon({
            html: renderToString(
                <FontAwesomeIcon
                    icon={faLocationDot}
                    style={{ color: "#eab308", fontSize: "32px" }}
                />,
            ),
            className: "",
            iconSize: [32, 32],
            iconAnchor: [16, 32],
            popupAnchor: [0, -32],
        });

        if (locations && locations.length > 0) {
            locations.forEach((item) => {
                const lat = item.latitude ?? item.departure?.coords?.[0];
                const lng = item.longitude ?? item.departure?.coords?.[1];
                if (!lat || !lng) return;

                const marker = L.marker([lat, lng], { icon: destIcon });
                marker.bindPopup(
                    `<b>${item.name}</b><br/><small>Click để chỉ đường đến đây</small>`,
                );
                marker.on("click", () => handleRouting([lat, lng]));
                marker.addTo(markerGroup);
            });
        }

        if (publicMarkers && publicMarkers.length > 0) {
            publicMarkers.forEach((pm: any) => {
                if (!pm.latitude || !pm.longitude) return;

                const popupHtml = `
                    <div style="width: 180px; font-family: sans-serif;">
                        <img src="${pm.coverImageUrl}" alt="${pm.title}" style="width: 100%; height: 100px; object-fit: cover; border-radius: 8px; margin-bottom: 8px;" />
                        <h3 style="margin: 0 0 4px 0; font-size: 14px; font-weight: bold; color: #1f2937;">${pm.title || "Điểm đánh dấu"}</h3>
                        <p style="margin: 0 0 8px 0; font-size: 12px; color: #4b5563; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">${pm.description || ""}</p>
                        <button onclick="window.handleRoutingFromPopup(${pm.latitude}, ${pm.longitude})" style="background: #eab308; color: white; border: none; padding: 6px 12px; border-radius: 6px; font-size: 11px; font-weight: bold; cursor: pointer; width: 100%;">📍 CHỈ ĐƯỜNG ĐẾN ĐÂY</button>
                    </div>
                `;

                const marker = L.marker([pm.latitude, pm.longitude], {
                    icon: yellowMarkerIcon,
                });
                marker.bindPopup(popupHtml);
                marker.addTo(markerGroup);
            });
        }

        (window as any).handleRoutingFromPopup = (lat: number, lng: number) => {
            handleRouting([lat, lng]);
        };

        return () => {
            markerGroup.clearLayers();
        };
    }, [locations, publicMarkers, isMapReady]);

    useEffect(() => {
        if (mapInstanceRef.current && selectedLocation && isMapReady) {
            mapInstanceRef.current.flyTo(selectedLocation, 12, {
                animate: true,
                duration: 1.5,
            });
        }
    }, [selectedLocation, isMapReady]);

    // ==============================================================
    // CÁC LOGIC TÌM ĐƯỜNG
    // ==============================================================
    const handleRouting = (destCoords: [number, number]) => {
        if (!mapInstanceRef.current) return;

        const currentStart = startCoordsRef.current;
        if (!currentStart)
            return alert(
                "Sếp ơi, nhập địa chỉ hoặc bấm lấy vị trí của sếp trước đã!",
            );
        if (!(L as any).Routing)
            return alert(
                "Hệ thống chỉ đường đang tải, vui lòng thử lại sau 1s...",
            );

        if (routingControlRef.current)
            mapInstanceRef.current.removeControl(routingControlRef.current);

        routingControlRef.current = (L as any).Routing.control({
            waypoints: [
                L.latLng(currentStart[0], currentStart[1]),
                L.latLng(destCoords[0], destCoords[1]),
            ],
            lineOptions: {
                styles: [{ color: "#2563eb", weight: 6, opacity: 0.8 }],
            },
            routeWhileDragging: false,
            addWaypoints: false,
            showAlternatives: false,
            collapsible: false,
            show: true,
            position: "bottomright",
            language: "vi",
            createMarker: function () {
                return null;
            },
        }).addTo(mapInstanceRef.current);

        setHasRoute(true);
        setShowRoutePanel(true);
        setShowSearch(false);
    };

    const setStartMarker = (lat: number, lon: number, popupText: string) => {
        if (!mapInstanceRef.current) return;
        if (startMarkerRef.current)
            mapInstanceRef.current.removeLayer(startMarkerRef.current);

        setStartCoords([lat, lon]);
        startCoordsRef.current = [lat, lon];
        mapInstanceRef.current.flyTo([lat, lon], 15);

        const newMarker = L.marker([lat, lon], {
            icon: L.divIcon({
                html: renderToString(
                    <FontAwesomeIcon
                        icon={faLocationDot}
                        style={{ color: "#3b82f6", fontSize: "32px" }}
                    />,
                ),
                className: "",
                iconSize: [32, 32],
                iconAnchor: [16, 32],
            }),
        })
            .addTo(mapInstanceRef.current)
            .bindPopup(popupText)
            .openPopup();

        startMarkerRef.current = newMarker;
    };

    const handleSearchAddress = async () => {
        if (!addressInput) return;
        try {
            const res = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(addressInput)}&limit=1`,
            );
            const data = await res.json();
            if (data.length > 0)
                setStartMarker(
                    parseFloat(data[0].lat),
                    parseFloat(data[0].lon),
                    "Điểm xuất phát của sếp",
                );
            else alert("Không tìm thấy địa chỉ này sếp ơi!");
        } catch (error) {
            console.error(error);
        }
    };

    const handleGetMyLocation = () => {
        if (!navigator.geolocation)
            return alert("Trình duyệt của sếp không hỗ trợ định vị!");
        navigator.geolocation.getCurrentPosition((pos) =>
            setStartMarker(
                pos.coords.latitude,
                pos.coords.longitude,
                "Bạn đang ở đây",
            ),
        );
    };

    return (
        <div
            className={`relative w-full h-full overflow-hidden bg-zinc-50 ${showRoutePanel ? "show-routing" : "hide-routing"}`}
        >
            <style
                dangerouslySetInnerHTML={{
                    __html: `
                .hide-routing .leaflet-routing-container { opacity: 0 !important; pointer-events: none !important; transform: translateY(20px) scale(0.95) !important; }
                .show-routing .leaflet-routing-container { opacity: 1 !important; pointer-events: auto !important; transform: translateY(0) scale(1) !important; }
                .leaflet-routing-container { position: absolute !important; bottom: 80px !important; right: 12px !important; width: 250px !important; background-color: #ffffff !important; border-radius: 10px !important; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1) !important; transition: all 0.3s ease !important; z-index: 1000 !important; margin: 0 !important; padding: 0 !important; overflow: hidden !important; }
                .leaflet-routing-alt h2, .leaflet-routing-alt h3 { color: #1e40af !important; font-weight: 800 !important; font-size: 13px !important; padding: 10px 12px !important; margin: 0 !important; background-color: #f8fafc !important; border-bottom: 1px solid #e2e8f0 !important; line-height: 1.2 !important; }
                .leaflet-routing-alt { max-height: 35vh !important; overflow-y: auto !important; background: white !important; }
                .leaflet-routing-alt::-webkit-scrollbar { width: 4px; }
                .leaflet-routing-alt::-webkit-scrollbar-track { background: transparent; }
                .leaflet-routing-alt::-webkit-scrollbar-thumb { background-color: #cbd5e1; border-radius: 10px; }
                .leaflet-routing-alt table { width: 100% !important; border-collapse: collapse !important; }
                .leaflet-routing-alt tr { border-bottom: 1px solid #f1f5f9 !important; }
                .leaflet-routing-alt td { color: #475569 !important; padding: 6px 8px !important; font-size: 11.5px !important; line-height: 1.3 !important; }
                .leaflet-routing-alt tr:last-child { border-bottom: none !important; }
                .leaflet-routing-alt tr:hover { background-color: #f1f5f9 !important; cursor: pointer; }
                @media (max-width: 640px) {
                    .leaflet-routing-container { bottom: 0 !important; right: 0 !important; left: 0 !important; width: 100% !important; max-width: 100% !important; border-radius: 20px 20px 0 0 !important; }
                    .hide-routing .leaflet-routing-container { transform: translateY(100%) !important; }
                    .leaflet-routing-alt { max-height: 40vh !important; }
                    .leaflet-routing-alt td { font-size: 12px !important; padding: 8px 12px !important; }
                }
            `,
                }}
            />

            {/* NÚT TÌM KIẾM */}
            <button
                onClick={() => setShowSearch(!showSearch)}
                className="absolute top-[80px] left-[10px] z-[1001] w-[34px] h-[34px] bg-white rounded shadow text-zinc-700 hover:text-blue-600 hover:bg-zinc-50 transition flex items-center justify-center border-[2px] border-black/20"
                title="Tìm kiếm điểm xuất phát"
            >
                <FontAwesomeIcon
                    icon={showSearch ? faTimes : faSearch}
                    size="sm"
                />
            </button>

            <div
                className={`absolute top-[80px] left-[55px] z-[1000] w-[calc(100vw-70px)] sm:w-[320px] flex flex-col gap-2 transition-all duration-300 origin-top-left ${showSearch ? "scale-100 opacity-100" : "scale-0 opacity-0 pointer-events-none"}`}
            >
                <div className="flex bg-white shadow-xl rounded-xl overflow-hidden border border-zinc-200">
                    <input
                        type="text"
                        value={addressInput}
                        onChange={(e) => setAddressInput(e.target.value)}
                        placeholder="Nhập điểm xuất phát..."
                        className="flex-1 text-zinc-900 px-3 py-2.5 outline-none text-sm font-medium"
                        onKeyDown={(e) =>
                            e.key === "Enter" && handleSearchAddress()
                        }
                    />
                    <button
                        onClick={handleSearchAddress}
                        className="px-4 bg-blue-600 text-white hover:bg-blue-700 transition"
                    >
                        <FontAwesomeIcon icon={faSearch} />
                    </button>
                </div>
                <button
                    onClick={handleGetMyLocation}
                    className="flex items-center justify-center gap-2 bg-white px-3 py-2.5 rounded-xl shadow-lg border border-zinc-200 text-xs font-bold text-zinc-700 hover:bg-zinc-50 transition active:scale-95"
                >
                    <FontAwesomeIcon
                        icon={faCrosshairs}
                        className="text-green-500 text-base"
                    />{" "}
                    LẤY VỊ TRÍ CỦA TÔI
                </button>
            </div>

            {hasRoute && (
                <button
                    onClick={() => setShowRoutePanel(!showRoutePanel)}
                    className={`absolute right-4 sm:right-6 z-[1002] w-14 h-14 bg-blue-600 rounded-full shadow-lg flex items-center justify-center text-white hover:bg-blue-700 transition-all duration-300 hover:shadow-blue-500/50 active:scale-95 ${showRoutePanel ? "bottom-[calc(45vh+16px)] sm:bottom-6" : "bottom-6"}`}
                >
                    <FontAwesomeIcon
                        icon={showRoutePanel ? faTimes : faRoute}
                        size="xl"
                    />
                </button>
            )}

            <div
                ref={mapContainerRef}
                style={{ height: "100%", width: "100%", zIndex: 0 }}
            />

            {/* 🔴 3. HIỂN THỊ MODAL THÊM MARKER KHI DOUBLE CLICK */}
            {showAddMarkerForm && newMarkerCoords && (
                <div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="w-full max-w-6xl relative max-h-[95vh] overflow-y-auto rounded-3xl"
                    >
                        <FormInsertMarker
                            initialData={{
                                latitude: newMarkerCoords.lat,
                                longitude: newMarkerCoords.lng,
                                isPublic: true,
                            }}
                            onClose={() => {
                                setShowAddMarkerForm(false);
                                fetchPublicMarkers(); // Load lại marker mới vừa thêm luôn cho nóng!
                            }}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default MapView;
