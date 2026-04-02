"use client";

import { useState } from "react";
import { apiGateway } from "../gateway/api.gateway";

interface UserProps {
  img: string;
  firstName: string;
  lastName: string;
  city: string;
  country: string;
}

export const useCreateUser = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const createUser = async (user: UserProps) => {
    setLoading(true);
    try {
      const response = await apiGateway.createUser(user);

      if (response.status === 201) {
        setSuccess(true);
        setLoading(false);
        return response.data;
      }
    } catch (err) {
      console.error("Erro [CREATE-USER-HOOK]: ", err);
      setError("Erro ao criar usuário");
    } finally {
      setLoading(false);
    }
  };

  return { createUser, loading, error, success };
};
