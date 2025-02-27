import React, { useState, useEffect } from "react";
import { Card, CardBody, Col, Container, Input, Label, Row, Button, Alert, Spinner } from "reactstrap";
import { useDispatch } from "react-redux";
import * as Yup from "yup";
import withRouter from "../../common/withRouter";
import { registerUser } from "../../Redux/Auth/action";

const Register = (props) => {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    address: "",
  });
  const [errors, setErrors] = useState({});
  const [passwordShow, setPasswordShow] = useState(false);
  const [loading, SetLoading] = useState(false)
  const [validationMessages, setValidationsMessages] = useState([]);

  const validationSchema = Yup.object().shape({
    username: Yup.string().required("Username is required"),
    email: Yup.string().matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,3}$/, "Invalid Email").required("Please Enter Email"),
    password: Yup.string().required("Password is required"),
  });

  const validateForm = async () => {
    try {
      await validationSchema.validate(formData, { abortEarly: false });
      setErrors({});
      setValidationsMessages([]);
      return true;
    } catch (validationErrors) {
      const formErrors = {};
      validationErrors.inner.forEach((error) => {
        formErrors[error.path] = error.message;
      });
      setErrors(formErrors);
      setValidationsMessages([]);
      return false;
    }
  };

  useEffect(() => {
    setTimeout(() => {
      const firstInput = document.getElementById("username");
      if (firstInput) { firstInput.focus(); }
    }, 100);
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (Object.keys(errors).length !== 0) setErrors({});
    setFormData((prev) => {
      return { ...prev, [name]: value, };
    });
  };

  const handleKeyDown = (e, nextFieldId) => {
    if (e.key === "Enter") {
      e.preventDefault();
      document.getElementById(nextFieldId).focus();
    }
  };

  const handleSubmit = async () => {
    const isValid = await validateForm();
    if (isValid) {
      SetLoading(true);
      const body = { ...formData, };
      try {
        await dispatch(registerUser(body, props.router.navigate));
      } catch (error) {
        const errorMessage = error?.response?.data?.error || "Not Register";
        setValidationsMessages([errorMessage]);
      } finally {
        SetLoading(false);
      }
    }
  };

  return (
    <div className="auth-page-content ">
      <Container >
        <Row className="justify-content-center mt-4">
          <Col md={8} lg={6} xl={5}>
            <Card className="mt-5">
              <CardBody className="p-4">
                <div className="text-center mt-2"><h5 className="text-primary">User Register</h5></div>
                {validationMessages.length > 0 && (
                  <Alert color="danger" fade={false}>
                    <div style={{ display: "flex", flexDirection: "column", color: "black" }}>
                      {validationMessages.map((msg, index) => (
                        <div key={index}>{msg}</div>
                      ))}
                    </div>
                  </Alert>
                )}
                <div className="p-2 mt-4">
                  <div className="mb-3">
                    <Label htmlFor="username" className="form-label">
                      Username
                    </Label>
                    <Input name="username" id="username" className="form-control"
                      placeholder="Enter Username" type="text" onChange={handleChange}
                      onKeyDown={(e) => handleKeyDown(e, "emailId")}
                      value={formData.username || ""}
                      invalid={errors && errors.username ? true : false}
                    />
                    {errors.username && (<div className="invalid-feedback">{errors.username}</div>)}
                  </div>
                  <div className="col-lg-12">
                    <div className="mb-3">
                      <Label htmlFor="customername-field" className="form-label">
                        Email
                      </Label>
                      <Input type="email" id="emailId" className="form-control"
                        placeholder="Enter Email" name="email"
                        onChange={handleChange} value={formData.email || ""}
                        onKeyDown={(e) => handleKeyDown(e, "passwordid")}
                        invalid={errors && errors.email ? true : false}
                      />
                      {errors.email && (<div className="invalid-feedback">{errors.email}</div>)}
                    </div>
                  </div>
                  <div className="mb-3">
                    <Label className="form-label" htmlFor="password-input">
                      Password
                    </Label>
                    <div className="position-relative auth-pass-inputgroup mb-3">
                      <Input name="password" id="passwordid" type={passwordShow ? "text" : "password"}
                        className="form-control pe-5" placeholder="Enter Password"
                        value={formData.password || ""} onChange={handleChange}
                        onKeyDown={(e) => handleKeyDown(e, "address")}
                        invalid={errors && errors.password ? true : false}
                      />
                      {errors.password && (<div className="invalid-feedback"> {errors.password} </div>)}
                      <button className="btn btn-link position-absolute end-0 top-0 text-decoration-none text-muted"
                        type="button" onClick={() => setPasswordShow(!passwordShow)} id="password-addon"
                      >
                        <i className="ri-eye-fill align-middle"></i>
                      </button>
                    </div>
                  </div>
                  <div className="mb-3">
                    <Label htmlFor="username" className="form-label">
                      Address
                    </Label>
                    <Input name="address" id="address" className="form-control"
                      placeholder="Enter Address" type="textarea" onChange={handleChange}
                      onKeyDown={(e) => handleKeyDown(e, "submitButton")} row={3}
                      value={formData.address || ""}
                    />
                  </div>
                  <div className="mt-4">
                    <Button color="success" id="submitButton" className="btn btn-success w-100"
                      onClick={(e) => handleSubmit(e)} disabled={loading}
                    >
                      <span className="d-flex align-items-center">
                        <span className="flex-grow-1 me-2">
                          Sign Up
                        </span>
                        {loading && (<Spinner size="sm" className="flex-shrink-0" role="status"></Spinner>)}
                      </span>
                    </Button>
                  </div>
                </div>
                <p className="mt-2">Already account<a href="/"> Login</a></p>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default withRouter(Register);

