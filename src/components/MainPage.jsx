import { useState } from "react";
import {
  Box,
  Button,
  Input,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  FormControl,
  FormLabel,
  Select,
  useDisclosure
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";

const schemaOptions = [
  { label: "First Name", value: "first_name" },
  { label: "Last Name", value: "last_name" },
  { label: "Gender", value: "gender" },
  { label: "Age", value: "age" },
  { label: "Account Name", value: "account_name" },
  { label: "City", value: "city" },
  { label: "State", value: "state" }
];

export default function SegmentForm() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { register, handleSubmit, reset, setValue, watch} = useForm();
  const [schemas, setSchemas] = useState([]);
  const [availableOptions, setAvailableOptions] = useState(schemaOptions);
  const [inputValues, setInputValues] = useState({});

  const onSubmit = (data) => {
    const formattedSchemas = schemas.map((schema) => ({
      [schema.value]: inputValues[schema.value] || schema.label
    }));

    const result = {
      segment_name: data.segment_name,
      schema: formattedSchemas
    };

    console.log(result); 
    reset();
    setSchemas([]);
    setAvailableOptions(schemaOptions);
    setInputValues({});
    onClose();
  };

  const addSchema = () => {
    const selectedSchema = watch("newSchema");

    if (selectedSchema) {
      const schemaToAdd = availableOptions.find(
        (option) => option.value === selectedSchema
      );

      setSchemas([...schemas, schemaToAdd]);
      setAvailableOptions(
        availableOptions.filter((option) => option.value !== selectedSchema)
      );

      setValue("newSchema", ""); 
    }
  };

  const handleInputChange = (schemaValue, inputValue) => {
    setInputValues({
      ...inputValues,
      [schemaValue]: inputValue
    });
  };

  return (
    <Box p={4}>
      <Button onClick={onOpen} colorScheme="blue">
        Save Segment
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Save Segment</ModalHeader>
          <ModalBody>
            <form id="segmentForm" onSubmit={handleSubmit(onSubmit)}>
              <FormControl mb={4} isRequired>
                <FormLabel>Segment Name</FormLabel>
                <Input
                  type="text"
                  placeholder="Enter segment name"
                  {...register("segment_name", { required: true })}
                />
              </FormControl>

              
              {schemas.length > 0 && (
                <Box border="1px solid blue" p={3} mb={4}>
                  {schemas.map((schema, index) => (
                    <Box key={index} mb={2}>
                      <FormControl>
                        <FormLabel>{schema.label}</FormLabel>
                        <Input
                          type="text"
                          placeholder={`Enter ${schema.label}`}
                          value={inputValues[schema.value] || ""}
                          onChange={(e) =>
                            handleInputChange(schema.value, e.target.value)
                          }
                        />
                      </FormControl>
                    </Box>
                  ))}
                </Box>
              )}

              <FormControl>
                <FormLabel>Add Schema to Segment</FormLabel>
                <Select
                  placeholder="Select schema"
                  {...register("newSchema")}
                >
                  {availableOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
              </FormControl>

              <Button mt={2} onClick={addSchema} colorScheme="green">
                + Add new schema
              </Button>
            </form>
          </ModalBody>

          <ModalFooter>
            <Button type="submit" form="segmentForm" colorScheme="blue" mr={3}>
              Save Segment
            </Button>
            <Button onClick={onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
