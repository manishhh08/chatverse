import { Form } from "react-bootstrap";

export const CustomInput = ({
  label,
  type = "text",
  options = [],
  value,
  onChange,
  ...rest
}) => {
  return (
    <Form.Group className="mb-4 d-flex flex-column">
      <Form.Label className="fw-bold text-start text-white">{label}</Form.Label>

      {type === "select" ? (
        <Form.Select value={value} onChange={onChange} {...rest}>
          <option value="">-- Select --</option>
          {options.map((opt) => {
            return (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            );
          })}
        </Form.Select>
      ) : (
        <Form.Control {...rest} type={type} value={value} onChange={onChange} />
      )}
    </Form.Group>
  );
};
