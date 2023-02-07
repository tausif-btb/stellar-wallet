import React, { useState } from "react";
import { sendTransaction } from "../../../../../../utils/send-transaction";
import {
  Text,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  InputGroup,
  Input,
  InputLeftAddon,
  Button,
  Divider,
  useToast
} from "@chakra-ui/core";

const SendTransaction = ({ secret, updateAccount }) => {
  // Este elemento sirve para crear notificaciones
  // Checar los docs en https://chakra-ui.com/toast
  const toast = useToast();

  // Dirección de destino y cantidad
  const [destination, setDestination] = useState("");
  const [amount, setAmount] = useState();

  // Función para enviar XLM a un destinatario
  const sendXLM = async () => {
    // Validamos los inputs
    if (destination.length === 56 && amount > 0) {
      try {
        // Ejecutamos la transacción
        const result = await sendTransaction(
          secret,
          destination,
          amount.toString()
        );
        toast({
          title: `They have been sent ${amount} XLM`,
          description: `Transaction hash: ${result.hash}`,
          status: "success",
          duration: 9000,
          isClosable: true
        });
        // Actualizamos la cuenta para que se refleje en nuestro balance
        updateAccount();
      } catch (err) {
        // Si hay un error, lo mostraremos
        toast({
          title: "An error has occurred",
          description: err.message,
          status: "error",
          duration: 9000,
          isClosable: true
        });
      }
    } else {
      // Si la cuenta es inválida o se intenta mandar menos de 0, hay que notificar
      toast({
        title: `Invalid data`,
        description:
          "Make sure you put a correct address and send a valid amount",
        status: "error",
        duration: 9000,
        isClosable: true
      });
    }
  };

  return (
    <>
      <Divider my={10} />
      <Text textAlign="center" fontSize="xl">
        Send XLM
      </Text>
      <NumberInput
        step="0.001"
        mt={2}
        value={amount}
        onChange={value => setAmount(value)}
      >
        <InputLeftAddon>XLM</InputLeftAddon>
        <NumberInputField roundLeft="0" />
        <NumberInputStepper>
          <NumberIncrementStepper />
          <NumberDecrementStepper />
        </NumberInputStepper>
      </NumberInput>
      <InputGroup mt={2}>
        <Input
          onChange={({ target: { value } }) => setDestination(value)}
          value={destination}
          placeholder="Recipient"
          roundRight="0"
        />
      </InputGroup>
      <Button mt={2} onClick={sendXLM} variantColor="blue">
        To send
      </Button>
    </>
  );
};

export default SendTransaction;
