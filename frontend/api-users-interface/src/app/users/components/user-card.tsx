import { useDeleteUser } from "@/app/api/hooks/delete-user.hook";
import Image from "next/image";
import { FaFilePen, FaRegTrashCan } from "react-icons/fa6";
import DeleteUserAlert from "./delete-user-alert";
import { useState } from "react";
import { toast } from "sonner";
import { User } from "@/types";
export interface UserProps {
  user: User;
  onDelete: () => void;
  onEdit: (user: User) => void;
}

export const UserCard = ({ user, onDelete, onEdit }: UserProps) => {
  const { deleteUser } = useDeleteUser();
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  const handleDelete = async () => {
    try {
      if (user.id) {
        await deleteUser(user.id);
        toast("Usuario deletado.");
        onDelete(); // chama refetch depois de deletar
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  return (
    <>
      <DeleteUserAlert
        isOpen={isAlertOpen}
        onConfirm={handleDelete}
        onCancel={() => setIsAlertOpen(false)}
      />
      <div
        key={user.id}
        className="flex flex-col lg:flex-row relative bg-[#765086] w-[140px] lg:w-[400px] h-[200px] justify-center items-center gap-1 lg:gap-7 p-3 pt-6 lg:p-6 border border-transparent rounded-2xl hover:border hover:border-[#52525270] hover:shadow-lg/30
  transition duration-300 ease-in-out"
      >
        <div className="absolute top-1 lg:top-5 right-1 lg:right-5 flex gap-0.5">
          <button
            onClick={() => onEdit(user)}
            className="lg:bg-[#765086] lg:hover:bg-[#483353] cursor-pointer transition duration-300 ease-in-out p-0.5 lg:p-1.5 pl-2 rounded-xl"
          >
            <FaFilePen color="white" size={16} />
          </button>
          <button
            onClick={() => setIsAlertOpen(true)}
            className="bg-[#765086] hover:bg-[#483353] cursor-pointer transition duration-300 ease-in-out p-1.5 rounded-xl"
          >
            <FaRegTrashCan color="white" size={16} />
          </button>
        </div>
        <Image
          src={user.img}
          alt={user.firstName}
          width={150}
          height={150}
          className="rounded-full bg-amber-100 w-20 h-20 lg:w-[150px] lg:h-[150px] object-cover"
        />
        <div className="pr-1 lg:pr-4 lg:text-left text-center">
          <h3 className="text-sm lg:text-xl font-bold text-white">
            {user.firstName} {user.lastName}
          </h3>
          <p className="text-white text-xs lg:text-base">
            {user.city}, {user.country}
          </p>
        </div>
      </div>
    </>
  );
};
