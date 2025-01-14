const QUERY_KEY = {
  SEAT_LIST: "seats",
  SEAT_LIST_ADMIN: "seatsAdmin",
  SEAT_BUTTON: "seatButton",
  ROOM_LIST: "roomList",
  ROOM_RESERVATION_LIST: "roomReservations",
  USER: "user",
  USER_LIST: "users",
  TEAM_LIST: "teams",
  MEMBER_LIST: "members", // teamMap과 결합된 Member[] 타입 배열
  PROFILE_IMAGE: "profileImage",
};

const DEFAULT_STALE_TIME = 5 * 60 * 1000;

export default QUERY_KEY;

export { DEFAULT_STALE_TIME };
