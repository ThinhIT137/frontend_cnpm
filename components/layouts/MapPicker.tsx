"use client";
import {
    MapContainer,
    TileLayer,
    Marker,
    useMapEvents,
    useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useState, useEffect } from "react";

const customIcon = new L.Icon({
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    iconRetinaUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

// COMPONENT PHỤ 1: ĐIỀU KHIỂN BẢN ĐỒ BAY TỚI TỌA ĐỘ TỪ DROPDOWN
function MapFlyTo({ center }: { center: { lat: number; lng: number } | null }) {
    const map = useMap();
    useEffect(() => {
        if (center && center.lat !== 0 && center.lng !== 0) {
            map.flyTo([center.lat, center.lng], 14, { duration: 1.5 });
        }
    }, [center, map]);
    return null;
}

// COMPONENT PHỤ 2: NÚT LẤY VỊ TRÍ HIỆN TẠI (GPS)
function LocateControl({
    setPosition,
    onLocationSelect,
}: {
    setPosition: (pos: L.LatLng) => void;
    onLocationSelect: (lat: number, lng: number) => void;
}) {
    const map = useMap();
    const [isLocating, setIsLocating] = useState(false);

    // Lắng nghe sự kiện khi map dò ra vị trí thành công hoặc thất bại
    useMapEvents({
        locationfound(e) {
            setPosition(e.latlng); // Đặt marker
            onLocationSelect(e.latlng.lat, e.latlng.lng); // Cập nhật Form
            map.flyTo(e.latlng, 15, { duration: 1.5 }); // Bay tới chỗ đó
            setIsLocating(false);
        },
        locationerror(e) {
            alert(
                "Không thể lấy vị trí! Sếp kiểm tra xem đã cấp quyền vị trí cho trình duyệt chưa nhé.",
            );
            setIsLocating(false);
        },
    });

    const handleLocate = (e: React.MouseEvent) => {
        e.preventDefault(); // Tránh submit form
        setIsLocating(true);
        map.locate(); // Kích hoạt GPS của Leaflet
    };

    return (
        <button
            onClick={handleLocate}
            title="Lấy vị trí hiện tại của tôi"
            className="absolute top-4 right-4 z-[1000] px-4 py-2 bg-white text-zinc-700 text-xs font-bold rounded-xl shadow-lg border border-zinc-200 hover:bg-sky-50 hover:text-sky-600 hover:border-sky-200 transition-all flex items-center gap-2"
        >
            {isLocating ? "⏳ Đang dò vị trí..." : "📍 Vị trí của tôi"}
        </button>
    );
}

interface MapPickerProps {
    initialPos?: { lat: number; lng: number };
    focusPos?: { lat: number; lng: number } | null;
    onLocationSelect: (lat: number, lng: number) => void;
}

export default function MapPicker({
    initialPos,
    focusPos,
    onLocationSelect,
}: MapPickerProps) {
    const [position, setPosition] = useState<L.LatLng | null>(
        initialPos && initialPos.lat !== 0
            ? new L.LatLng(initialPos.lat, initialPos.lng)
            : null,
    );

    // COMPONENT LẮNG NGHE CLICK VÀO BẢN ĐỒ
    function LocationMarker() {
        useMapEvents({
            click(e) {
                setPosition(e.latlng);
                onLocationSelect(e.latlng.lat, e.latlng.lng);
            },
        });
        return position === null ? null : (
            <Marker position={position} icon={customIcon} />
        );
    }

    return (
        <div className="h-[300px] w-full rounded-xl overflow-hidden border border-zinc-200 shadow-inner z-0 relative">
            <MapContainer
                center={
                    initialPos && initialPos.lat !== 0
                        ? [initialPos.lat, initialPos.lng]
                        : [16.047079, 108.20623]
                } // Mặc định ở giữa VN
                zoom={initialPos && initialPos.lat !== 0 ? 15 : 5}
                scrollWheelZoom={true}
                style={{ height: "100%", width: "100%", zIndex: 0 }}
            >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <LocationMarker />

                {/* Lắng nghe thay đổi dropdown để bay */}
                <MapFlyTo center={focusPos || null} />

                {/* Nút bấm lấy vị trí GPS */}
                <LocateControl
                    setPosition={setPosition}
                    onLocationSelect={onLocationSelect}
                />
            </MapContainer>

            <p className="text-[10px] text-zinc-500 mt-1 italic text-center absolute bottom-2 left-0 right-0 bg-white/70 backdrop-blur-sm py-1 font-bold z-[1000] pointer-events-none">
                👆 Click vào bản đồ để ghim tọa độ
            </p>
        </div>
    );
}
