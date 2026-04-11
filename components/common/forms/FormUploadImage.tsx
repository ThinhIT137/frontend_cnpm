import { profileApi } from "@/app/api/profileApi";
import { supabase } from "@/libs/supabase";
import { useState, useEffect } from "react";

export function FormUploadImage({
    entityType,
    entityId,
    initialImages = [],
}: {
    entityType: string;
    entityId: number;
    initialImages?: any[];
}) {
    // 1. STATE QUẢN LÝ DỮ LIỆU
    const [existingImages, setExistingImages] = useState<any[]>([]);
    const [files, setFiles] = useState<{ file: File; preview: string }[]>([]);

    // Cuốn sổ tử thần: Lưu ID những tấm ảnh cũ bị bấm xóa
    const [deletedImageIds, setDeletedImageIds] = useState<number[]>([]);

    // State thống nhất 1 ảnh bìa duy nhất cho cả cũ và mới
    // type: 'old' (ảnh cũ), 'new' (ảnh mới up)
    // val: ID (nếu là old) hoặc Index (nếu là new)
    const [coverState, setCoverState] = useState<{
        type: "old" | "new" | null;
        val: number | null;
    }>({ type: null, val: null });

    const [isUploading, setIsUploading] = useState(false);

    // 2. KHỞI TẠO DỮ LIỆU CŨ KHI SỬA
    useEffect(() => {
        if (initialImages && initialImages.length > 0) {
            setExistingImages(initialImages);
            // Tìm thằng nào đang làm Cover thì set nó làm trùm mặc định
            const currentCover = initialImages.find((img) => img.isCover);
            if (currentCover) {
                setCoverState({ type: "old", val: currentCover.id });
            }
        }
    }, [initialImages]);

    // Dọn dẹp RAM (ảnh xem trước)
    useEffect(() => {
        return () => {
            files.forEach((f) => URL.revokeObjectURL(f.preview));
        };
    }, [files]);

    // 3. XỬ LÝ CHỌN FILE VÀ XÓA TẠM THỜI TRÊN UI
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const newFiles = Array.from(e.target.files).map((file) => ({
                file,
                preview: URL.createObjectURL(file),
            }));
            setFiles((prev) => [...prev, ...newFiles]);
        }
        e.target.value = "";
    };

    const handleRemoveNewFile = (indexToRemove: number) => {
        setFiles((prev) => prev.filter((_, idx) => idx !== indexToRemove));
        // Đang set cover cho file mới mà lỡ xóa nó thì reset
        if (coverState.type === "new" && coverState.val === indexToRemove) {
            setCoverState({ type: null, val: null });
        }
    };

    const handleMarkDeleteOldImage = (imgId: number) => {
        // Đưa vào danh sách chờ chém
        setDeletedImageIds((prev) => [...prev, imgId]);
        // Ẩn nó khỏi UI
        setExistingImages((prev) => prev.filter((img) => img.id !== imgId));
        // Nếu nó đang là cover thì lột chức
        if (coverState.type === "old" && coverState.val === imgId) {
            setCoverState({ type: null, val: null });
        }
    };

    // 4. LƯU TẤT CẢ (LƯU ẢNH MỚI + XÓA ẢNH CŨ + SET COVER)
    const handleSaveAllChanges = async () => {
        setIsUploading(true);
        try {
            // -- HÀNH ĐỘNG 1: TRẢM NHỮNG ẢNH BỊ ĐÁNH DẤU XÓA --
            if (deletedImageIds.length > 0) {
                const deletePromises = deletedImageIds.map((id) =>
                    profileApi.deleteImage(id),
                );
                await Promise.all(deletePromises);
            }

            // -- HÀNH ĐỘNG 2: UPLOAD ẢNH MỚI --
            let newSavedImages: any[] = [];
            if (files.length > 0) {
                const uploadPromises = files.map(async (item, index) => {
                    const fileExt = item.file.name.split(".").pop();
                    const fileName = `${entityType}_${entityId}_${Date.now()}_${index}.${fileExt}`;

                    await supabase.storage
                        .from("Image")
                        .upload(fileName, item.file, {
                            cacheControl: "3600",
                            upsert: false,
                        });
                    const { data: publicUrlData } = supabase.storage
                        .from("Image")
                        .getPublicUrl(fileName);

                    return {
                        url: publicUrlData.publicUrl,
                        isCover:
                            coverState.type === "new" &&
                            coverState.val === index, // Tự động set cover nếu đc tick
                        entityType: entityType,
                        entityId: entityId,
                    };
                });

                const uploadedImagesData = await Promise.all(uploadPromises);
                const saveDbPromises = uploadedImagesData.map((payload) =>
                    profileApi.saveImageLink(payload),
                );
                const results = await Promise.all(saveDbPromises);
                newSavedImages = results.map((res) => res.data).filter(Boolean);
            }

            // -- HÀNH ĐỘNG 3: SET COVER CHO ẢNH CŨ (Nếu người dùng tick vào ảnh cũ) --
            if (coverState.type === "old" && coverState.val !== null) {
                await profileApi.setCoverImage(
                    coverState.val,
                    entityType,
                    entityId,
                );
            }

            alert("💾 Cập nhật Dữ liệu Ảnh thành công mĩ mãn!");

            // -- RESET LẠI UI VÀ TRẠNG THÁI --
            setDeletedImageIds([]);
            setFiles([]);

            // Cập nhật lại UI ảnh cũ bao gồm cả những tấm vừa up
            setExistingImages((prev) => {
                let updated = [...prev];
                // Reset cờ isCover trên UI nội bộ
                updated = updated.map((img) => ({
                    ...img,
                    isCover:
                        coverState.type === "old" && img.id === coverState.val,
                }));
                return [...updated, ...newSavedImages];
            });
        } catch (error) {
            alert("❌ Có lỗi xảy ra trong quá trình lưu!");
            console.error(error);
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="bg-sky-50/80 p-6 rounded-3xl border-2 border-sky-200 flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h3 className="font-black text-sky-900 text-xl uppercase tracking-tight">
                        📸 Quản lý Hình ảnh
                    </h3>
                    <p className="text-xs text-sky-700 font-medium mt-1">
                        Chỉ 1 nút LƯU cho tất cả thao tác (Thêm ảnh, Xóa ảnh,
                        Chọn ảnh bìa).
                    </p>
                </div>
                <label className="px-6 py-3 bg-white text-sky-600 font-bold rounded-xl border border-sky-200 hover:bg-sky-100 transition-all cursor-pointer flex items-center gap-2 shadow-sm">
                    <span>➕ Chọn ảnh mới để Up</span>
                    <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleFileChange}
                        className="hidden"
                    />
                </label>
            </div>

            <div className="bg-white rounded-2xl border border-zinc-200 p-4 flex flex-col gap-6">
                {/* DANH SÁCH ẢNH CŨ TRÊN DB */}
                {existingImages.length > 0 && (
                    <div className="flex flex-col gap-3">
                        <p className="text-xs font-bold text-zinc-500 uppercase border-b border-zinc-100 pb-2">
                            Ảnh đã lưu trên hệ thống
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            {existingImages.map((img) => (
                                <div
                                    key={img.id}
                                    className={`relative flex items-center gap-3 p-2 rounded-xl border-2 transition-all ${coverState.type === "old" && coverState.val === img.id ? "border-sky-500 bg-sky-50" : "border-zinc-200"}`}
                                >
                                    <div className="w-16 h-16 shrink-0 rounded-lg overflow-hidden border border-zinc-200">
                                        <img
                                            src={img.url}
                                            alt="anh"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2 flex-1">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="globalCover"
                                                checked={
                                                    coverState.type === "old" &&
                                                    coverState.val === img.id
                                                }
                                                onChange={() =>
                                                    setCoverState({
                                                        type: "old",
                                                        val: img.id,
                                                    })
                                                }
                                                className="w-4 h-4 accent-sky-600"
                                            />
                                            <span className="text-xs font-bold text-zinc-700">
                                                Ảnh Bìa
                                            </span>
                                        </label>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleMarkDeleteOldImage(img.id)
                                            }
                                            className="text-[10px] uppercase font-bold text-red-500 hover:text-white hover:bg-red-500 px-2 py-1 rounded-md border border-red-200 transition-colors self-start"
                                        >
                                            🗑️ Xóa
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* DANH SÁCH ẢNH CHỜ UPLOAD */}
                {files.length > 0 && (
                    <div className="flex flex-col gap-3">
                        <p className="text-xs font-bold text-sky-600 uppercase border-b border-sky-100 pb-2">
                            Ảnh chờ Upload (Chưa lưu)
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            {files.map((item, index) => (
                                <div
                                    key={index}
                                    className={`relative flex items-center gap-3 p-2 rounded-xl border-2 transition-all ${coverState.type === "new" && coverState.val === index ? "border-sky-500 bg-sky-50" : "border-zinc-200 border-dashed"}`}
                                >
                                    <div className="w-16 h-16 shrink-0 rounded-lg overflow-hidden border border-zinc-200 relative">
                                        <img
                                            src={item.preview}
                                            alt="preview"
                                            className="w-full h-full object-cover"
                                        />
                                        <span className="absolute bottom-0 inset-x-0 bg-yellow-400 text-yellow-900 text-[8px] font-bold text-center">
                                            NEW
                                        </span>
                                    </div>
                                    <div className="flex flex-col gap-2 flex-1 overflow-hidden">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="globalCover"
                                                checked={
                                                    coverState.type === "new" &&
                                                    coverState.val === index
                                                }
                                                onChange={() =>
                                                    setCoverState({
                                                        type: "new",
                                                        val: index,
                                                    })
                                                }
                                                className="w-4 h-4 accent-sky-600"
                                            />
                                            <span className="text-xs font-bold text-zinc-700">
                                                Ảnh Bìa
                                            </span>
                                        </label>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleRemoveNewFile(index)
                                            }
                                            className="text-[10px] uppercase font-bold text-zinc-500 hover:text-white hover:bg-zinc-500 px-2 py-1 rounded-md border border-zinc-200 transition-colors self-start"
                                        >
                                            ✖️ Hủy Up
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* NÚT CHỐT SỔ */}
            {(files.length > 0 ||
                deletedImageIds.length > 0 ||
                coverState.type !== null) && (
                <div className="flex flex-col items-end gap-2">
                    <p className="text-xs text-zinc-500 font-medium">
                        Bạn có thao tác chưa lưu (Up mới: {files.length}, Xóa:{" "}
                        {deletedImageIds.length})
                    </p>
                    <button
                        type="button"
                        onClick={handleSaveAllChanges}
                        disabled={isUploading}
                        className="px-8 py-4 bg-sky-600 text-white font-black text-lg rounded-2xl hover:bg-sky-700 active:scale-95 transition-all shadow-xl shadow-sky-200 disabled:opacity-50"
                    >
                        {isUploading
                            ? "⏳ ĐANG XỬ LÝ TOÀN BỘ..."
                            : `💾 LƯU TẤT CẢ THAY ĐỔI ẢNH`}
                    </button>
                </div>
            )}
        </div>
    );
}
