"use client";

import { useEffect, useRef } from "react";
// Bỏ luôn chữ react-leaflet, mình xài hàng gốc của Leaflet
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import { renderToString } from "react-dom/server";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { MapViewProps } from "@/types/MapViewProps";

const MapView = ({ locations, selectedLocation }: MapViewProps) => {
    // Tạo 2 cái thẻ quản lý DOM để không cho React nhúng tay vào
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<L.Map | null>(null);
    const markersLayerRef = useRef<L.LayerGroup | null>(null);

    useEffect(() => {
        // Nếu trình duyệt chưa tải xong thẻ div, đứng yên đó
        if (typeof window === "undefined" || !mapContainerRef.current) return;
        // 1. Chỉ khởi tạo bản đồ 1 lần duy nhất, cấm render lại
        if (!mapInstanceRef.current) {
            // L.map sẽ tự động dán bản đồ vào thẻ div
            mapInstanceRef.current = L.map(mapContainerRef.current, {
                zoomSnap: 0.1,
                zoomDelta: 0.1,
            }).setView([15.8, 105.8], 5.8);
            L.tileLayer(
                "https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}&hl=vi",
                {
                    attribution: "© Google Maps",
                },
            ).addTo(mapInstanceRef.current);
            // Tạo một cái rổ để chứa các cục Marker
            markersLayerRef.current = L.layerGroup().addTo(
                mapInstanceRef.current,
            );
        }
        const map = mapInstanceRef.current;
        const markerGroup = markersLayerRef.current;
        // 2. Tạo Icon đỏ rực
        const fontAwesomeIcon = L.divIcon({
            html: renderToString(
                <FontAwesomeIcon
                    icon={faLocationDot}
                    style={{ color: "#ef4444", fontSize: "36px" }}
                />,
            ),
            className: "",
            iconSize: [36, 36],
            iconAnchor: [18, 36],
            popupAnchor: [0, -36],
        });
        // 3. Mỗi lần có data mới, dọn sạch rổ Marker cũ đi rồi cắm Marker mới
        if (markerGroup) {
            markerGroup.clearLayers();
            locations.forEach((item) => {
                const marker = L.marker([item.latitude, item.longitude], {
                    icon: fontAwesomeIcon,
                });
                // Dán popup thủ công
                marker.bindPopup(
                    `<div style="font-family: sans-serif; font-weight: bold; color: #1f2937;">${item.name}</div>`,
                );
                marker.addTo(markerGroup);
            });
        }
        // BÍ KÍP TỐI THƯỢNG CỨU THẾ GIỚI: Hàm dọn dẹp khi Next.js Hot Reload
        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove(); // Tự tay đập bản đồ cũ
                mapInstanceRef.current = null;
            }
        };
    }, [locations]); // Chỉ chạy lại cục này nếu danh sách locations thay đổi

    useEffect(() => {
        if (mapInstanceRef.current && selectedLocation) {
            mapInstanceRef.current.flyTo(selectedLocation, 12, {
                animate: true,
                duration: 1.5,
            });
        }
    }, [selectedLocation]);

    return (
        // Thẻ div trống trơn, giao phó sinh mệnh lại cho Leaflet tự xử
        <div
            ref={mapContainerRef}
            style={{ height: "100%", width: "100%", zIndex: 0 }}
        />
    );
};

export default MapView;
