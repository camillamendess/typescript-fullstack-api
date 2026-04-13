import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface DeleteUserAlertProps {
  isOpen: boolean; // Controla se o alerta está aberto
  onConfirm: () => void; // Função chamada ao confirmar a exclusão
  onCancel: () => void;
}

const DeleteUserAlert = ({
  isOpen,
  onConfirm,
  onCancel,
}: DeleteUserAlertProps) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={onCancel}>
      <AlertDialogContent className="bg-[#483353] w-[460px] text-white border-none flex flex-col justify-center items-center">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-center">
            Tem certeza que deseja deletar este usuário?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-white text-center">
            Essa ação não pode ser desfeita. O usuário será removido
            permanentemente.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            className="w-20 cursor-pointer border-none bg-[#765086] text-white hover:bg-[#644774] transition duration-300 ease-in-out"
            onClick={onCancel}
          >
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            className="w-20 cursor-pointer bg-red-700 text-white hover:bg-red-600 transition duration-300 ease-in-out"
            onClick={onConfirm}
          >
            Deletar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteUserAlert;
