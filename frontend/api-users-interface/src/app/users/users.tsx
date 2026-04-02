"use client";

import { useGetUsers } from "../api/hooks/get-users.hook";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { AddUserDialog } from "./components/add-user-dialog";
import { UserCard } from "./components/user-card";
import { useSearchUsers } from "../api/hooks/get-search-users.hook";
import { useDebounce } from "@/utils/useDebounce";
import { User } from "@/types";

const UsersPage = () => {
  const [openModal, setOpenModal] = useState(false);
  const [userToEdit, setUserToEdit] = useState<User | null>(null); // <- guarda o user para edição
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const { data: users, loading: hookLoading, error, refetch } = useGetUsers();
  const { data: seachResults, loading: searchLoading } =
    useSearchUsers(debouncedSearchTerm);

  const displayedUsers = searchTerm ? seachResults : users;

  // Estado customizado para delay no carregamento
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!hookLoading && !searchLoading) {
      const timeout = setTimeout(() => setLoading(false), 1000);
      return () => clearTimeout(timeout);
    } else {
      setLoading(true);
    }
  }, [hookLoading, searchLoading]);

  const onSubmit = () => {
    setOpenModal(false);
    setUserToEdit(null); // limpa depois de salvar
    refetch();
  };

  const handleEditUser = (user: User) => {
    setUserToEdit(user);
    setOpenModal(true);
  };

  const LoadingIndicator = () => (
    <div className="flex justify-center items-center gap-2 text-white mt-4">
      <Loader2 className="h-8 w-8 animate-spin" />
      <span>Carregando usuários...</span>
    </div>
  );

  return (
    <>
      <AddUserDialog
        open={openModal}
        onOpenChange={(isOpen) => {
          setOpenModal(isOpen);
          if (!isOpen) setUserToEdit(null); // limpa ao fechar
        }}
        onSubmit={onSubmit}
        user={userToEdit} // passa para o modal
      />

      <div className="flex flex-col justify-center items-center p-8 pb-2">
        <h1 className="text-3xl font-bold text-white">Users</h1>
        <div className="flex justify-center items-center gap-2">
          <input
            type="text"
            placeholder="Search"
            className="border border-[#ffffff31] w-56 md:w-[400px] lg:w-[500px] rounded-2xl p-2 mt-2 focus:outline-none  text-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button
            className="bg-[#765086] text-white p-4 lg:p-5 rounded-2xl mt-2 cursor-pointer hover:bg-[#483353] transition duration-300 ease-in-out"
            onClick={() => {
              setUserToEdit(null); // garante que está limpando
              setOpenModal(true);
            }}
          >
            Add User
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-4 rounded-2xl mt-4 pt-2">
        {loading || searchLoading ? (
          <LoadingIndicator />
        ) : !error && displayedUsers && displayedUsers.length > 0 ? (
          displayedUsers.map((user) => (
            <UserCard
              key={user.id}
              user={user}
              onDelete={refetch}
              onEdit={handleEditUser} // passa a função para o card
            />
          ))
        ) : (
          !loading &&
          !searchLoading &&
          debouncedSearchTerm && (
            <p className="text-white">Nenhum usuário encontrado.</p>
          )
        )}
      </div>
    </>
  );
};

export default UsersPage;
