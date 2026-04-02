import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Image from "next/image";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useFormContext } from "react-hook-form";
import { UserFormValues } from "./user-schema";
import { useCreateUser } from "@/app/api/hooks/create-user.hook";
import { useUpdateUser } from "@/app/api/hooks/update-user.hook";
import { useEffect, ChangeEvent } from "react";
import { User } from "@/types";

const fields: Array<{
  name: "firstName" | "lastName" | "city" | "country";
  label: string;
  placeholder: string;
}> = [
  { name: "firstName", label: "First Name", placeholder: "John" },
  { name: "lastName", label: "Last Name", placeholder: "Doe" },
  { name: "city", label: "City", placeholder: "New York" },
  { name: "country", label: "Country", placeholder: "USA" },
] as const;

interface UserFormProps {
  onSubmit: (data: UserFormValues) => void;
  onClose: () => void;
  user?: User | null;
}

export const UserForm = ({ onSubmit, onClose, user }: UserFormProps) => {
  const form = useFormContext<UserFormValues>();
  const { register, setValue, watch } = useFormContext<UserFormValues>();
  const { createUser } = useCreateUser();
  const { updateUser } = useUpdateUser();

  // Observa o campo 'img' para mostrar o preview em tempo real
  const imgValue = watch("img");

  useEffect(() => {
    register("img");
  }, [register]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        // Transforma a imagem em string e salva no formulário
        setValue("img", reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

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

  const handleSubmit = async (values: UserFormValues) => {
    try {
      if (user && user.id) {
        await updateUser({ id: user.id, ...values });
        toast.success("Usuário atualizado com sucesso!");
      } else {
        await createUser(values);
        toast.success("Usuário criado com sucesso!");
      }
      onSubmit(values);
      form.reset();
      onClose();
    } catch (error: unknown) {
      console.error("Error saving user:", error);
      toast.error("Erro ao salvar usuário.");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        {fields.map(({ name, label, placeholder }) => (
          <FormField
            key={name}
            control={form.control}
            name={name}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{label}</FormLabel>
                <FormControl>
                  <Input placeholder={placeholder} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}
        <div className="flex flex-col gap-3 w-[128px] items-center">
          {/* Preview da Imagem */}
          <FormLabel>Upload de imagem</FormLabel>
          <div className="relative w-24 h-24 border-2 border-dashed border-gray-300 rounded-full overflow-hidden flex items-center justify-center bg-gray-50">
            {imgValue ? (
              <Image
                src={imgValue}
                alt="Preview"
                width={96}
                height={96}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-xs text-gray-400">Sem foto</span>
            )}
          </div>

          {/* Input de arquivo escondido */}
          <label className="cursor-pointer bg-[#6d4c7d41] text-[#00000083] px-4 py-2 rounded-md text-sm transition-colors  text-center">
            Selecionar Foto
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>
        </div>
        <Button
          type="submit"
          className="bg-[#6d4c7d] text-white cursor-pointer"
        >
          {user ? "Update" : "Add"}
        </Button>
      </form>
    </Form>
  );
};
