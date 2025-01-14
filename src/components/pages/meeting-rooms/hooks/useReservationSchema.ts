import { isEndTimeAfterStartTime } from "@/lib/utils/timeUtils";
import { z } from "zod";

import useReservationTimeValidation from "./useReservationTimeValidation";

function useReservationSchema() {
  const { hasTimeConflict, isLoading } = useReservationTimeValidation();

  return z
    .object({
      title: z
        .string()
        .min(1, "미팅 제목을 입력해주세요")
        .max(20, "미팅 제목은 20자 이내로 입력해주세요")
        .trim()
        .refine(
          (value) => value.length > 0,
          "미팅 제목은 공백만으로 구성될 수 없습니다",
        ),
      resourceId: z.string().min(1, "선택해주세요"),
      startTime: z
        .string()
        .min(1, "필수 입력란")
        .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "유효하지 않은 형식"),
      endTime: z
        .string()
        .min(1, "필수 입력란")
        .regex(/^([01]\d|2[0-4]):([0-5]\d)$/, "유효하지 않은 형식"),
      participants: z
        .array(
          z.object({
            id: z.string(),
            name: z.string(),
            email: z.string(),
            teams: z.array(z.string()),
            profileImage: z.string(),
          }),
        )
        .min(1, "참여자는 최소 1명 이상이어야 합니다.")
        .max(30, "참여자는 최대 30명까지 가능합니다."),
    })
    .superRefine((data, ctx) => {
      const { startTime, endTime, resourceId } = data;

      if (isLoading || !startTime || !endTime || !resourceId) {
        return;
      }

      if (!isEndTimeAfterStartTime(startTime, endTime)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "유효한 시간대를 입력해주세요.",
          path: ["endTime"],
        });
        return;
      }

      if (!hasTimeConflict(startTime, endTime, resourceId)) {
        return;
      }

      if (hasTimeConflict(startTime, startTime, resourceId)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "이미 예약된 회의가 있습니다.",
          path: ["startTime"],
        });
      }

      if (hasTimeConflict(endTime, endTime, resourceId)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "이미 예약된 회의가 있습니다.",
          path: ["endTime"],
        });
      }

      if (
        !hasTimeConflict(startTime, startTime, resourceId) &&
        !hasTimeConflict(endTime, endTime, resourceId)
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "이미 예약된 회의가 있습니다.",
          path: ["endTime"],
        });
      }
    });
}

export default useReservationSchema;
