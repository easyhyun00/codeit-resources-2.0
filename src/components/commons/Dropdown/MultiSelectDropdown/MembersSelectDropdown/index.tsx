/* eslint-disable no-nested-ternary */
import Badge from "@/components/commons/Badge";
import ProfileImage from "@/components/commons/ProfileImage";
import { VARIANTS } from "@/constants/dropdownConstants";
import useDropdown from "@/hooks/useDropdown";
import ArrowDown from "@public/icons/icon-arrow-down.svg";
import CheckedBox from "@public/icons/icon-checkbox-active.svg";
import DisabledCheckedBox from "@public/icons/icon-checkbox-disabled.svg";
import UnCheckedBox from "@public/icons/icon-checkbox.svg";
import SearchIcon from "@public/icons/icon-search.svg";
import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import { createContext, useContext, useMemo, useState } from "react";

import {
  Member,
  MemberItemProps,
  MembersSelectDropdownContextType,
  MembersSelectDropdownProps,
} from "../../dropdownType";

const MembersSelectDropdownContext =
  createContext<MembersSelectDropdownContextType | null>(null);

const useMembersSelectDropdownContextType = () => {
  const context = useContext(MembersSelectDropdownContext);
  if (!context) {
    throw new Error(
      "useMultiSelectDropdownContext must be used within a Provider",
    );
  }

  return context;
};

export default function MembersSelectDropdown({
  selectedMembers,
  onSelect,
  onRemove,
  allMembers,
  disabledMembers = [],
}: MembersSelectDropdownProps) {
  const { isOpen, toggleDropdown, closeDropdown, dropdownRef } = useDropdown();

  const contextProviderValue = useMemo(
    () => ({
      isOpen,
      selectedMembers,
      toggleDropdown,
      closeDropdown,
      onSelect,
      onRemove,
    }),
    [isOpen, selectedMembers],
  );

  return (
    <MembersSelectDropdownContext.Provider value={contextProviderValue}>
      <div ref={dropdownRef} className="relative">
        <Toggle />
        <SearchWrapper
          allMembers={allMembers}
          disabledMembers={disabledMembers}
        />
      </div>
    </MembersSelectDropdownContext.Provider>
  );
}

function Toggle() {
  const { isOpen, toggleDropdown, selectedMembers } =
    useMembersSelectDropdownContextType();

  return (
    <button
      type="button"
      onClick={toggleDropdown}
      className="group relative flex h-56 w-full items-center justify-between rounded-8 border border-gray-100-opacity-60 px-20 py-14 text-left text-16 hover:border-purple-70"
    >
      <span className="absolute left-10 top-[-9px] bg-white pr-1 text-13 text-gray-100-opacity-60 group-hover:text-purple-70">
        참여자
      </span>
      <span
        className={clsx("min-w-0 flex-grow text-16-400", {
          "text-gray-100-opacity-80 group-hover:text-gray-100": !isOpen,
          "text-gray-100": isOpen,
        })}
      >
        <div className="flex max-h-40 max-w-full gap-2 overflow-x-auto">
          {selectedMembers.length > 0 ? (
            selectedMembers.map((member) => (
              <Badge key={member.id} variant="secondarySmall">
                {member.name}
              </Badge>
            ))
          ) : (
            <span className="text-gray-100-opacity-50">
              참여자를 선택해 주세요.
            </span>
          )}
        </div>
      </span>
      <ArrowDown
        className={clsx(
          "ml-8 w-12 flex-shrink-0 transition-transform duration-100",
          {
            "rotate-180": isOpen,
          },
        )}
      />
    </button>
  );
}

function SearchWrapper({
  allMembers,
  disabledMembers,
}: {
  allMembers: Member[];
  disabledMembers: string[];
}) {
  const { isOpen, selectedMembers, onSelect, onRemove } =
    useMembersSelectDropdownContextType(); // 컨텍스트 사용

  const [searchQuery, setSearchQuery] = useState(""); // 검색어 상태

  // 검색어에 맞게 멤버 필터링
  const filteredMembers = allMembers.filter(
    (member) =>
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.teams.some((dept) =>
        dept.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="dropdown-wrapper-base max-h-300 w-full"
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={VARIANTS.fade}
          transition={{ duration: 0.1 }}
        >
          <div>
            <SearchIcon className="absolute left-15 top-18" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="mb-4 h-40 w-full rounded-8 border border-gray-30 bg-gray-10 pl-30 pr-2 text-16-400"
              placeholder="이름 및 부서로 검색"
            />
          </div>

          {/* 필터링된 멤버 목록을 렌더링 */}
          {filteredMembers.map((member) => (
            <MemberItem
              key={member.id}
              member={member}
              isSelected={selectedMembers.some(
                (selectedMember) => selectedMember.name === member.name,
              )}
              onSelect={onSelect}
              onRemove={onRemove}
              disabled={disabledMembers.includes(member.id)}
            />
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function MemberItem({
  member,
  isSelected,
  onSelect,
  onRemove,
  disabled,
}: MemberItemProps) {
  const handleClick = () => {
    if (disabled && isSelected) return; // 예약자는 체크 선택 해제 불가
    if (isSelected) {
      onRemove(member); // 선택 해제
    } else {
      onSelect(member); // 선택
    }
  };

  return (
    <button
      type="button"
      className={clsx(
        "flex items-center gap-5 rounded-8 px-12 py-6 text-15-500",
        {
          "bg-purple-opacity-10 text-purple-80": isSelected && !disabled,
          // 예약자인 경우의 스타일
          "cursor-default bg-gray-20 text-gray-100-opacity-80":
            disabled && isSelected,
          "text-gray-100-opacity-80 hover:bg-purple-opacity-5 hover:text-purple-80":
            !isSelected,
          "cursor-not-allowed opacity-50": disabled && !isSelected,
        },
      )}
      onClick={handleClick}
      disabled={disabled && !isSelected}
    >
      {isSelected ? (
        disabled ? (
          <DisabledCheckedBox className="mr-5 w-16 flex-shrink-0" />
        ) : (
          <CheckedBox className="mr-5 w-16 flex-shrink-0" />
        )
      ) : (
        <UnCheckedBox className="mr-5 w-16 flex-shrink-0" />
      )}

      <div className="flex-shrink-0">
        <ProfileImage size="sm" />
      </div>
      <span className="mt-2 flex-shrink-0">{member.name}</span>
      <div className="flex-grow overflow-x-auto">
        <div className="flex gap-3">
          {member.teams.map((dept) => (
            <Badge key={dept} variant="secondarySmallSquare">
              {dept}
            </Badge>
          ))}
        </div>
      </div>
    </button>
  );
}
