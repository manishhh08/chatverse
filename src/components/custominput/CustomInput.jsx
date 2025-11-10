import { Form, InputGroup } from "react-bootstrap";

export const CustomInput = ({
  label,
  type = "text",
  name,
  value,
  onChange,
  placeholder,
  icon,
  append,
  ...rest
}) => {
  return (
    <Form.Group className="mb-3">
      {label && <Form.Label className="fw-bold text-white">{label}</Form.Label>}

      <InputGroup className="bg-dark rounded-3">
        {icon && (
          <InputGroup.Text className="bg-dark border-0 text-white">
            {icon}
          </InputGroup.Text>
        )}

        <Form.Control
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="bg-dark text-white border-0"
          {...rest}
        />

        {append && (
          <InputGroup.Text className="bg-dark border-0">
            {append}
          </InputGroup.Text>
        )}
      </InputGroup>
    </Form.Group>
  );
};
