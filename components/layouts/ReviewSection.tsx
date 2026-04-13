"use client";

import { profileApi } from "@/app/api/profileApi";
import { useLoading } from "@/context/LoadingContext";
import React, { useState, useEffect } from "react";
// 🔴 IMPORT REPORT MODAL & ICON
import ReportModal from "@/components/layouts/ReportModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFlag } from "@fortawesome/free-solid-svg-icons";

// --- TYPES DÀNH CHO UI ---
export type UserProps = {
    id: string;
    name: string;
    avt: string;
    role: string;
};

export type ReviewUIProps = {
    id: number;
    userId: string;
    userName: string;
    userAvt: string;
    userRole: string;
    score: number;
    comment: string;
    createdAt: string;
};

type ReviewSectionProps = {
    entityId: number;
    entityType: string; // "hotel", "tour", "tourist_area"...
    currentUser: UserProps | null;
    onReviewSuccess?: () => void;
};

// --- ICON SAO (SVG) ---
const StarIcon = ({ filled, onClick, onMouseEnter, onMouseLeave }: any) => (
    <svg
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        className={`w-8 h-8 cursor-pointer transition-colors duration-200 ${filled ? "text-yellow-400" : "text-zinc-200 hover:text-yellow-200"}`}
        fill="currentColor"
        viewBox="0 0 20 20"
    >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
);

export default function ReviewSection({
    entityId,
    entityType,
    currentUser,
    onReviewSuccess,
}: ReviewSectionProps) {
    const [reviews, setReviews] = useState<ReviewUIProps[]>([]);
    const { setLoading } = useLoading();

    // Form State
    const [score, setScore] = useState(5);
    const [hoverScore, setHoverScore] = useState(0);
    const [commentText, setCommentText] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    // 🔴 STATE QUẢN LÝ REPORT COMMENT
    const [isReportOpen, setIsReportOpen] = useState(false);
    const [reportedReviewId, setReportedReviewId] = useState<number | null>(
        null,
    );

    const fetchReviews = async () => {
        if (!entityId || !entityType) return;
        setLoading(true);
        try {
            const res = await profileApi.getReviews(entityType, entityId);

            if (res && res.success && res.data) {
                const mappedData = res.data.map((item: any) => ({
                    id: item.id,
                    userName: item.userName || "Khách",
                    userAvt: item.userAvt || "/Img/User_Icon.png",
                    userRole: item.userRole || "user",
                    score: item.star,
                    comment: item.content,
                    createdAt: item.createdAt,
                }));
                setReviews(mappedData);
            } else {
                setReviews([]);
            }
        } catch (error) {
            console.error("Lỗi lấy danh sách đánh giá", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, [entityId, entityType]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentUser) return alert("Vui lòng đăng nhập để bình luận!");
        if (commentText.trim().length === 0)
            return alert("Vui lòng nhập bình luận!");

        setIsSubmitting(true);
        try {
            const payload = {
                EntityType: entityType,
                EntityId: entityId,
                Star: score,
                Content: commentText,
            };

            const res = await profileApi.submitReview(payload);

            if (res && res.success) {
                setCommentText("");
                setScore(5);
                fetchReviews();
                if (onReviewSuccess) onReviewSuccess();
            } else {
                alert("Có lỗi xảy ra: " + (res?.message || "Không lưu được!"));
            }
        } catch (error) {
            alert("Lỗi gửi đánh giá!");
        } finally {
            setIsSubmitting(false);
        }
    };

    // 🔴 Xử lý khi nhấn nút Báo cáo của 1 comment cụ thể
    const handleReportClick = (reviewId: number) => {
        if (!currentUser) return alert("Vui lòng đăng nhập để báo cáo!");
        setReportedReviewId(reviewId);
        setIsReportOpen(true);
    };

    return (
        <div className="bg-white rounded-3xl shadow-sm border border-zinc-100 p-6 mt-8">
            <h2 className="text-xl font-black text-zinc-800 mb-6 border-b border-zinc-100 pb-4">
                ⭐ Khách hàng đánh giá{" "}
                <span className="text-zinc-400 text-base font-medium">
                    ({reviews.length})
                </span>
            </h2>

            {/* FORM ĐÁNH GIÁ */}
            {currentUser ? (
                <form
                    onSubmit={handleSubmit}
                    className="mb-8 flex flex-col gap-3"
                >
                    <div className="flex items-center gap-2 mb-2">
                        {[1, 2, 3, 4, 5].map((s) => (
                            <StarIcon
                                key={s}
                                filled={s <= (hoverScore || score)}
                                onClick={() => setScore(s)}
                                onMouseEnter={() => setHoverScore(s)}
                                onMouseLeave={() => setHoverScore(0)}
                            />
                        ))}
                        <span className="ml-3 text-sm font-bold text-zinc-500">
                            {score === 5
                                ? "Tuyệt vời"
                                : score === 4
                                  ? "Tốt"
                                  : score === 3
                                    ? "Tạm được"
                                    : score === 2
                                      ? "Kém"
                                      : "Rất tệ"}
                        </span>
                    </div>

                    <div className="relative">
                        <img
                            src={currentUser.avt}
                            className="absolute left-3 top-3 w-8 h-8 rounded-full object-cover shadow-sm"
                            alt="avt"
                            onError={(e) =>
                                (e.currentTarget.src = "/Img/User_Icon.png")
                            }
                        />
                        <textarea
                            rows={3}
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            placeholder="Chia sẻ trải nghiệm của bạn..."
                            className="w-full pl-14 pr-4 py-3 rounded-2xl border border-zinc-200 focus:ring-2 focus:ring-blue-200 outline-none text-sm text-zinc-700 resize-none bg-zinc-50 focus:bg-white transition-all"
                        />
                    </div>
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={isSubmitting || !commentText.trim()}
                            className="px-6 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white text-sm font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                        >
                            {isSubmitting ? "Đang gửi..." : "Gửi Đánh Giá"}
                        </button>
                    </div>
                </form>
            ) : (
                <p className="text-sm text-zinc-500 mb-8 italic text-center p-4 bg-zinc-50 rounded-xl border border-zinc-100">
                    Vui lòng đăng nhập để gửi đánh giá.
                </p>
            )}

            {/* DANH SÁCH ĐÁNH GIÁ (ĐÃ ĐƯỢC REDESIGN) */}
            <div className="flex flex-col gap-6">
                {reviews.length > 0 ? (
                    reviews.map((rev) => (
                        <div key={rev.id} className="flex gap-4 group relative">
                            {/* Avatar */}
                            <img
                                src={rev.userAvt}
                                alt="avt"
                                className="w-12 h-12 rounded-full object-cover shrink-0 border border-zinc-200 shadow-sm"
                                onError={(e) =>
                                    (e.currentTarget.src = "/Img/User_Icon.png")
                                }
                            />

                            {/* Nội dung Comment */}
                            <div className="bg-zinc-50 p-4 rounded-2xl rounded-tl-none w-full border border-zinc-100 group-hover:border-zinc-200 transition-colors">
                                <div className="flex justify-between items-start mb-1">
                                    <div>
                                        <h4 className="font-bold text-zinc-800 text-sm flex items-center gap-2">
                                            {rev.userName}
                                            {rev.userRole === "admin" && (
                                                <span className="bg-red-500 text-white text-[9px] px-1.5 py-0.5 rounded uppercase">
                                                    Admin
                                                </span>
                                            )}
                                            {(rev.userRole === "hotel" ||
                                                rev.userRole === "tour") && (
                                                <span className="bg-amber-500 text-white text-[9px] px-1.5 py-0.5 rounded uppercase">
                                                    Đối tác
                                                </span>
                                            )}
                                        </h4>
                                        <div className="flex text-yellow-400 mt-1">
                                            {[...Array(5)].map((_, i) => (
                                                <svg
                                                    key={i}
                                                    className={`w-3.5 h-3.5 ${i < rev.score ? "text-yellow-400" : "text-zinc-300"}`}
                                                    fill="currentColor"
                                                    viewBox="0 0 20 20"
                                                >
                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                </svg>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <span className="text-xs text-zinc-400 font-medium">
                                            {new Date(
                                                rev.createdAt,
                                            ).toLocaleDateString("vi-VN", {
                                                day: "2-digit",
                                                month: "2-digit",
                                                year: "numeric",
                                            })}
                                        </span>

                                        {/* 🔴 NÚT REPORT COMMENT Ở ĐÂY NÀY */}
                                        <button
                                            onClick={() =>
                                                handleReportClick(rev.id)
                                            }
                                            className="text-zinc-300 hover:text-red-500 transition-colors"
                                            title="Báo cáo bình luận này"
                                        >
                                            <FontAwesomeIcon
                                                icon={faFlag}
                                                size="sm"
                                            />
                                        </button>
                                    </div>
                                </div>
                                <p className="text-sm text-zinc-700 whitespace-pre-line leading-relaxed mt-2">
                                    {rev.comment}
                                </p>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-center text-sm text-zinc-400 py-4">
                        Chưa có đánh giá nào. Hãy là người đầu tiên!
                    </p>
                )}
            </div>

            {/* 🔴 RENDER CÁI MODAL REPORT RA ĐÂY */}
            {reportedReviewId && (
                <ReportModal
                    isOpen={isReportOpen}
                    onClose={() => {
                        setIsReportOpen(false);
                        setReportedReviewId(null);
                    }}
                    entityId={reportedReviewId}
                    entityType="review" // Cực kỳ quan trọng: Type bây giờ là "review"
                />
            )}
        </div>
    );
}
