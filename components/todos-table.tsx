"use client";

import React from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Button,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Spinner,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/react";
import { Todo, FocusTodoType, CustomModalType } from "@/types";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { VerticalDotsIcon } from "./icons";

export default function TodosTable({ todos }: { todos: Todo[] }) {
  //할인추가가능여부
  const [todoAddFlag, setTodoAaddFlag] = useState(false);

  //입력된 할일
  const [newTodoInput, setNewTodoInput] = useState("");
  const [isLoading, setIsLoading] = useState<Boolean>(false);

  //모달 상태
  const [currentModalStatus, setCurrentModalStatus] = useState<FocusTodoType>({
    focusTodo: null,
    modalType: "detail" as CustomModalType,
  });
  const router = useRouter();

  const addTodoHandler = async () => {
    if (newTodoInput.length < 1) {
      return;
    }
    setTodoAaddFlag(false);
    setIsLoading(true);
    await new Promise((f) => setTimeout(f, 1000));
    await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/todos`, {
      method: "post",
      body: JSON.stringify({
        title: newTodoInput,
      }),
      cache: "no-store",
    });
    setNewTodoInput("");
    router.refresh();
    setIsLoading(false);
    setTodoAaddFlag(false);
    notifyEvent("할일이 등록되었습니다.");
  };

  const disabledAddButton = () => {
    return (
      <Popover placement="top">
        <PopoverTrigger>
          <Button color="default" className="h-18">
            등록하기
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          <div className="px-1 py-2">
            <div className="text-small font-bold">📝</div>
            <div className="text-tiny">할일을 입력해주세요</div>
          </div>
        </PopoverContent>
      </Popover>
    );
  };

  const TodosRows = (todo: Todo) => {
    return (
      <TableRow key={todo.id}>
        <TableCell>{todo.id.slice(0, 4)}</TableCell>
        <TableCell>{todo.title}</TableCell>
        <TableCell>{todo.is_done ? "완료" : "미완료"}</TableCell>
        <TableCell>{`${todo.create_at}`}</TableCell>
        <TableCell>
          <div className="relative flex justify-end items-center gap-2">
            <Dropdown>
              <DropdownTrigger>
                <Button isIconOnly size="sm" variant="light">
                  <VerticalDotsIcon className="text-default-300" />
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                onAction={(key) => {
                  console.log("key:", key);
                  setCurrentModalStatus({
                    focusTodo: todo,
                    modalType: key as CustomModalType,
                  });
                  onOpen();
                }}
              >
                <DropdownItem key="detail">상세보기</DropdownItem>
                <DropdownItem key="update">수정</DropdownItem>
                <DropdownItem key="delete">삭제</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        </TableCell>
      </TableRow>
    );
  };

  const notifyEvent = (msg: string) => toast.success(msg);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const ModalComponent = () => {
    return (
      <div>
        <Modal backdrop="blur" isOpen={isOpen} onOpenChange={onOpenChange}>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  Modal Title
                </ModalHeader>
                <ModalBody>
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Nullam pulvinar risus non risus hendrerit venenatis.
                    Pellentesque sit amet hendrerit risus, sed porttitor quam.
                  </p>
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Nullam pulvinar risus non risus hendrerit venenatis.
                    Pellentesque sit amet hendrerit risus, sed porttitor quam.
                  </p>
                  <p>
                    Magna exercitation reprehenderit magna aute tempor cupidatat
                    consequat elit dolor adipisicing. Mollit dolor eiusmod sunt
                    ex incididunt cillum quis. Velit duis sit officia eiusmod
                    Lorem aliqua enim laboris do dolor eiusmod. Et mollit
                    incididunt nisi consectetur esse laborum eiusmod pariatur
                    proident Lorem eiusmod et. Culpa deserunt nostrud ad veniam.
                  </p>
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="light" onPress={onClose}>
                    Close
                  </Button>
                  <Button color="primary" onPress={onClose}>
                    Action
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </div>
    );
  };

  return (
    <div className="flex flex-col space-y-2">
      {ModalComponent()}
      <ToastContainer
        position="top-right"
        autoClose={1000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
        <Input
          type="text"
          label="새로운 할일"
          value={newTodoInput}
          onValueChange={(changedInput) => {
            setNewTodoInput(changedInput);
            setTodoAaddFlag(changedInput.length > 0);
          }}
        />
        {todoAddFlag ? (
          <Button
            color="warning"
            className="h-18"
            onPress={async () => {
              await addTodoHandler();
            }}
          >
            등록하기
          </Button>
        ) : (
          disabledAddButton()
        )}
      </div>
      <div className="h-4">
        {isLoading && <Spinner color="warning" size="sm" />}
      </div>

      <Table aria-label="Example static collection table">
        <TableHeader>
          <TableColumn>아이디 </TableColumn>
          <TableColumn>할일</TableColumn>
          <TableColumn>완료여부</TableColumn>
          <TableColumn>생성일</TableColumn>
          <TableColumn>액션</TableColumn>
        </TableHeader>
        <TableBody emptyContent={"할일이 없습니다."}>
          {todos && todos.map((todo: Todo) => TodosRows(todo))}
        </TableBody>
      </Table>
    </div>
  );
}
