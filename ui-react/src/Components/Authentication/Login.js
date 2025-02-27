import React, { useState, useEffect } from "react";
import { Card, CardBody, Col, Container, Input, Label, Row, Button, Alert, Spinner } from "reactstrap";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import withRouter from "../../common/withRouter";
import { loginUser } from "../../Redux/Auth/action";

const Login = (props) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    rememberMe: false,
  });
  const [errors, setErrors] = useState({});
  const [passwordShow, setPasswordShow] = useState(false);
  const [loading, SetLoading] = useState(false)
  const [validationMessages, setValidationsMessages] = useState([]);

  const validationSchema = Yup.object().shape({
    username: Yup.string().required("Username is required"),
    password: Yup.string().required("Password is required"),
  });

  useEffect(() => {
    const savedCredentials = localStorage.getItem("rememberMe")
      ? JSON.parse(localStorage.getItem("credentials"))
      : null;
    if (savedCredentials) {
      setFormData({ ...savedCredentials, rememberMe: true });
    }
  }, []);

  useEffect(() => {
    if (sessionStorage.getItem("token")) {
      navigate("/customer", { replace: true });
    }
  }, [navigate]);

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
      if (formData.rememberMe) {
        localStorage.setItem("rememberMe", "true");
        localStorage.setItem("credentials", JSON.stringify({
          username: formData.username,
          password: formData.password,
        }));
      } else {
        localStorage.removeItem("rememberMe");
        localStorage.removeItem("credentials");
      }

      try {
        await dispatch(loginUser(body, props.router.navigate));
      } catch (error) {
        const errorMessage = error?.response?.data?.error || "Invalid credentials";
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
                <div className="text-center mt-2">
                  <h5 className="text-primary">Welcome to Login </h5>
                </div>
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
                      onKeyDown={(e) => handleKeyDown(e, "passwordid")}
                      value={formData.username || ""}
                      invalid={errors && errors.username ? true : false}
                    />
                    {errors.username && (<div className="invalid-feedback">{errors.username}</div>)}
                  </div>

                  <div className="mb-3">
                    <Label className="form-label" htmlFor="password-input">
                      Password
                    </Label>
                    <div className="position-relative auth-pass-inputgroup mb-3">
                      <Input name="password" id="passwordid" type={passwordShow ? "text" : "password"}
                        className="form-control pe-5" placeholder="Enter Password"
                        value={formData.password || ""} onChange={handleChange}
                        onKeyDown={(e) => handleKeyDown(e, "submitButton")}
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
                  <div className="form-check">
                    <Input className="form-check-input" type="checkbox" checked={formData.rememberMe}
                      onChange={(e) => setFormData({ ...formData, rememberMe: e.target.checked })} id="auth-remember-check"
                    />
                    <Label className="form-check-label" htmlFor="auth-remember-check" >
                      Remember me
                    </Label>
                  </div>
                  <div className="mt-4">
                    <Button color="success" id="submitButton" className="btn btn-success w-100" onClick={(e) => handleSubmit(e)} disabled={loading} >
                      <span className="d-flex align-items-center">
                        <span className="flex-grow-1 me-2"> Sign In </span>
                        {loading && (<Spinner size="sm" className="flex-shrink-0" role="status"></Spinner>)}
                      </span>
                    </Button>
                  </div>
                  <p className="mt-2">Don't have an account<a href="/register"> Register</a></p>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default withRouter(Login);

