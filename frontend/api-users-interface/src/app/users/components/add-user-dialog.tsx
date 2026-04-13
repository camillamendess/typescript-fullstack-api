import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserForm } from "./user-form/user-form";
import { UserFormValues, userSchema } from "./user-form/user-schema";
import { useEffect } from "react";
import { User } from "@/types";

interface AddUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: UserFormValues) => void;
  user?: (User & { id?: string }) | null;
}

export const AddUserDialog = ({
  open,
  onOpenChange,
  onSubmit,
  user,
}: AddUserDialogProps) => {
  const form = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      city: "",
      country: "",
      img: "",
    },
  });

  useEffect(() => {
    if (user) {
      form.reset(user);
    } else {
      form.reset({
        firstName: "",
        lastName: "",
        city: "",
        country: "",
        img: "",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleSubmit = async (data: UserFormValues) => {
    await onSubmit({ ...user, ...data }); // se user existir, envia junto o id
    form.reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {user ? "Editar Usuário" : "Adicionar Usuário"}
          </DialogTitle>
        </DialogHeader>
        <FormProvider {...form}>
          <UserForm
            onSubmit={handleSubmit}
            onClose={() => onOpenChange(false)}
            user={user}
          />
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
};
