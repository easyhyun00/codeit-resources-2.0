import ScrollContainer from "@/components/Layout/Scroll/ScrollContainer";
import { RESOURCE_LABELS } from "@/constants/common";
import {
  Reservation,
  ResourceType,
  RoomReservation,
} from "@/lib/api/amplify/helper";

import EmptyReservation from "./EmptyReservation";
import ReservationCard from "./ReservationCard";

const RESOURCE_INFO: Record<ResourceType, Record<string, string>> = {
  ROOM: {
    subTitle: "오늘의 회의 일정을 확인해보세요 ;)",
  },
  SEAT: {
    subTitle: "오늘의 좌석을 확인하세요",
  },
  EQUIPMENT: {
    subTitle: "오늘의 장비 대여 일정을 확인해보세요",
  },
};

function MyReservation({
  resourceType,
  reservationList,
}: {
  resourceType: ResourceType;
  reservationList: Reservation[] | RoomReservation[];
}) {
  return (
    <section className="mb-80 flex flex-col gap-16">
      <h1 className="text-24-700 text-gray-100 md:text-28-700">
        내 {RESOURCE_LABELS[resourceType]}
        <span className="ml-12 text-14-500 text-gray-70">
          {RESOURCE_INFO[resourceType].subTitle}
        </span>
      </h1>
      <span className="h-1 w-full border-b-[1px] border-gray-100-opacity-10" />
      <ScrollContainer>
        <div className="flex gap-16 pb-16">
          {reservationList.length === 0 ? (
            <EmptyReservation resourceType={resourceType} />
          ) : (
            reservationList?.map(
              (reservation: Reservation | RoomReservation) => (
                <ReservationCard
                  key={reservation.id}
                  reservation={reservation}
                  isDetailed={resourceType === "ROOM"}
                />
              ),
            )
          )}
        </div>
      </ScrollContainer>
    </section>
  );
}

export default MyReservation;
