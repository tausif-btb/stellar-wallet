import React, { useState } from "react";
import StellarSdk from "stellar-sdk";
import {
  Heading,
  Text,
  Button,
  InputGroup,
  Input,
  useToast
} from "@chakra-ui/core";
import { createTestAccount } from "../../../../utils/create-pair";

const Start = ({ setPublicKey, setSecret, setKeyCopied }) => {
  // Este elemento sirve para crear notificaciones
  // Checar los docs en https://chakra-ui.com/toast
  const toast = useToast();

  // Valor del secret a importar
  const [secretToImport, setSecretToImport] = useState("");

  // Función para crear una cuenta
  const createAccount = () => {
    const keys = createTestAccount();

    // Guardamos las llaves en la sesión
    localStorage.setItem("secret", keys.secret);
    localStorage.setItem("publicKey", keys.publicKey);
    // Actualizamos la vista y pasamos a copy
    setPublicKey(keys.publicKey);
    setSecret(keys.secret);
  };

  // Función para importar una cuenta desde el secret
  const importAccount = () => {
    // Todas las secret keys tienen una longitud de 56 caracteres
    if (secretToImport.length === 56) {
      const sourceKeys = StellarSdk.Keypair.fromSecret(secretToImport);

      // Al importar una cuenta, hay que guardar todos los flags en localStorage para mantener la sesión
      localStorage.setItem("secret", secretToImport);
      localStorage.setItem("publicKey", sourceKeys.publicKey());
      localStorage.setItem("keyCopied", true);

      // Con esto actualizamos correctamente la vista
      setPublicKey(sourceKeys.publicKey());
      setSecret(secretToImport);
      setKeyCopied(true);
    } else {
      toast({
        title: "Error",
        description: "Make sure your secret key is correct.",
        status: "error",
        duration: 9000,
        isClosable: true
      });
    }
  };

  return (
    <>
      <Heading>Welcome to your Stellar wallet</Heading>
      <Text fontSize="xl">
        Create your stellar account quickly and easily
      </Text>
      <Button onClick={createAccount} size="lg" variantColor="blue" mt="24px">
        Create Account
      </Button>
      <Text mt={10}>Or import your account with your secret</Text>
      <InputGroup>
        <Input
          onChange={({ target: { value } }) => setSecretToImport(value)}
          value={secretToImport}
          placeholder="Account to check"
          roundRight="0"
        />
        <Button onClick={importAccount} variantColor="green">
          Import
        </Button>
      </InputGroup>
    </>
  );
};

export default Start;
