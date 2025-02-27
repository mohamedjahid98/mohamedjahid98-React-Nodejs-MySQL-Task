import React, { useState, useEffect, useRef } from "react";
import { Modal, ModalBody, Input, Label, Button, Alert, Spinner } from "reactstrap";
import { useDispatch } from "react-redux";
import * as Yup from "yup";
import Select from "react-select";
import { saveCustomer, updateCustomer } from "../../Redux/thunks";

const CreateModal = ({ showModal, onShowAddModal, customerData, pagination, }) => {
    const dispatch = useDispatch();
    const selectRefs = useRef({});
    const phoneRefs = useRef({});

    const [customerId, SetCustomerId] = useState();

    const [formData, setFormData] = useState({
        customerName: "",
        contactNo: "",
        email: "",
        postalCode: "",
        stateId: "",
        countryId: "",
        addressLine1: "",
        addressLine2: "",
        addressLine3: "",
    });

    const [loading, SetLoading] = useState(false)
    const [errors, setErrors] = useState({});
    const [validationMessages, setValidationsMessages] = useState([]);

    useEffect(() => {
        if (customerData && customerData.id) {
            SetCustomerId(customerData?.id)
            setFormData((prev) => {
                return {
                    ...prev,
                    customerName: customerData?.customerName ?? "",
                    contactNo: customerData?.contactNo ?? "",
                    postalCode: customerData?.postalCode ?? "",
                    email: customerData?.email ?? "",
                    stateId: customerData?.stateId ?? "",
                    countryId: customerData?.countryId ?? "",
                    addressLine1: customerData?.addressLine1 ?? "",
                    addressLine2: customerData?.addressLine2 ?? "",
                    addressLine3: customerData?.addressLine3 ?? "",
                };
            });
        } else {
            resetFormData();
        }
    }, [customerData]);

    const resetFormData = () => {
        setFormData({
            customerName: "",
            contactNo: "",
            email: "",
            postalCode: "",
            stateId: "",
            countryId: "",
            addressLine1: "",
            addressLine2: "",
            addressLine3: "",
        });
    };

    useEffect(() => {
        setTimeout(() => {
            const firstInput = document.getElementById("name");
            if (firstInput) { firstInput.focus(); }
        }, 100);
    }, []);

    const validationSchema = Yup.object().shape({
        customerName: Yup.string().required("Please Enter Customer Name"),
        contactNo: Yup.string().required("Please Enter Contact No"),
        email: Yup.string().matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,3}$/, "Invalid Email").required("Please Enter Email"),
        stateId: Yup.string().required("Please Select State"),
        countryId: Yup.string().required("Please Select Country"),

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

    const handleChange = (id, value) => {
        if (Object.keys(errors).length !== 0) setErrors({});
        setFormData((prev) => {
            return { ...prev, [id]: value, };
        });
    };

    const handleKeyDown = (e, nextFieldId) => {
        if (e.key === "Enter") {
            e.preventDefault();
            if (selectRefs.current[nextFieldId]) {
                selectRefs.current[nextFieldId].focus();
                selectRefs.current[nextFieldId].openMenu();
            } else if (phoneRefs.current[nextFieldId]) {
                phoneRefs.current[nextFieldId].focus();
            } else {
                const nextField = document.getElementById(nextFieldId);
                if (nextField) { nextField.focus(); }
            }
        }
    };

    const restrictInvalidChars = (e, nextFieldId) => {
        if (["e", "E", "-", "+", "."].includes(e.key)) { e.preventDefault(); }
        if (e.key === "Enter") { handleKeyDown(e, nextFieldId); }
    };

    const handleSubmit = async () => {
        const isValid = await validateForm();
        if (isValid) {
            SetLoading(true)
            const body = {
                formData: { ...formData, },
                pagination,
            };
            const response = await dispatch(saveCustomer(body));
            if (response.payload && response.payload.response) {
                const errorMessage = response.payload.response.data.error;
                setValidationsMessages([errorMessage]);
                SetLoading(false);
            } else {
                handleClose();
            }
        }
    };

    const handleUpdate = async () => {
        const isValid = await validateForm();
        if (isValid) {
            SetLoading(true)
            const body = {
                formData: {
                    ...formData, id: customerId,
                },
                pagination,
            };
            const response = await dispatch(updateCustomer(body));
            if (response.payload && response.payload.response) {
                const errorMessage = response.payload.response.data.error;
                setValidationsMessages([errorMessage]);
                SetLoading(false);
            } else {
                handleClose();
            }
        }
    };

    const handleClose = () => {
        resetFormData();
        onShowAddModal();
        setErrors({});
        setValidationsMessages([]);
    };

    const countryOptions = [
        { value: "India", label: "India" },
        { value: "USA", label: "USA" },
        { value: "Canada", label: "Canada" },
    ];


    const stateOptions = [
        { value: "Andhra Pradesh", label: "Andhra Pradesh" },
        { value: "Karnataka", label: "Karnataka" },
        { value: "Maharashtra", label: "Maharashtra" },
        { value: "Tamil Nadu", label: "Tamil Nadu" },
    ];


    return (
        <Modal size="lg" isOpen={showModal} centered backdrop="static" keyboard={false}>
            <div className="modal-header bg-light p-3">
                {customerId ? "Update" : "Add"} Customer
                <Button type="button" onClick={handleClose} className="btn-close float-left btn btn-light" aria-label="Close" ></Button>
            </div>
            <ModalBody>
                {errors && typeof errors === "object" &&
                    Object.keys(errors).length !== 0 && (
                        <Alert color="danger" fade={false}>
                            <div style={{ display: "flex", flexDirection: "column", color: "black", }}>
                                Please fill all mandatory fields
                            </div>
                        </Alert>
                    )}
                {validationMessages.length > 0 && (
                    <Alert color="danger" fade={false}>
                        <div style={{ display: "flex", flexDirection: "column", color: "black", }}>
                            {validationMessages.map((msg, index) => (
                                <div key={index}>{msg}</div>
                            ))}
                        </div>
                    </Alert>
                )}
                <div className="row">
                    <h5 className="mt-1">Customer Details</h5>
                    <div className="col-lg-6">
                        <div className="mb-3">
                            <Label htmlFor="field" className="form-label">
                                Customer Name
                            </Label>
                            <Input type="text" id="name" className="form-control"
                                placeholder="Enter Customer Name" name="customerName"
                                onChange={(e) => handleChange("customerName", e.target.value)}
                                value={formData.customerName || ""}
                                onKeyDown={(e) => handleKeyDown(e, "emailId")}
                                invalid={errors && errors.customerName ? true : false}
                            />
                            {errors.customerName && (<div className="invalid-feedback">{errors.customerName}</div>)}
                        </div>
                    </div>
                    <div className="col-lg-6">
                        <div className="mb-3">
                            <Label htmlFor="customername-field" className="form-label">
                                Email
                            </Label>
                            <Input type="email" id="emailId" className="form-control"
                                placeholder="Enter Email" name="email"
                                onChange={(e) => handleChange("email", e.target.value)}
                                value={formData.email || ""}
                                onKeyDown={(e) => handleKeyDown(e, "contactNo")}
                                invalid={errors && errors.email ? true : false}
                            />
                            {errors.email && (<div className="invalid-feedback">{errors.email}</div>)}
                        </div>
                    </div>
                    <div className="col-lg-6">
                        <div className="mb-3">
                            <Label htmlFor="customername-field" className="form-label">
                                Contact No
                            </Label>
                            <Input type="number" id="contactNo" className="form-control"
                                placeholder="Enter Contact No" name="contactNo"
                                onChange={(e) => { const value = e.target.value.slice(0, 10); handleChange("contactNo", value); }}
                                value={formData.contactNo || ""}
                                onKeyDown={(e) => handleKeyDown(e, "addressLine1")}
                                invalid={errors && errors.contactNo ? true : false}
                            />
                            {errors.contactNo && (<div className="invalid-feedback">{errors.contactNo}</div>)}
                        </div>
                    </div>
                    <h5 className="mt-1">Contact Details</h5>
                    <div className="col-lg-6">
                        <div className="mb-3">
                            <Label htmlFor="field" className="form-label">
                                Address Line 1
                            </Label>
                            <Input type="text" id="addressLine1" className="form-control"
                                placeholder="Enter Address Line 1" name="addressLine1"
                                onChange={(e) => handleChange("addressLine1", e.target.value)}
                                value={formData.addressLine1 || ""}
                                onKeyDown={(e) => handleKeyDown(e, "addressLine2")}
                                invalid={errors && errors.addressLine1 ? true : false}
                            />
                        </div>
                    </div>
                    <div className="col-lg-6">
                        <div className="mb-3">
                            <Label htmlFor="field" className="form-label">
                                Address Line 2
                            </Label>
                            <Input type="text" id="addressLine2" className="form-control"
                                placeholder="Enter Address Line 2" name="addressLine2"
                                onChange={(e) => handleChange("addressLine2", e.target.value)}
                                value={formData.addressLine2 || ""}
                                onKeyDown={(e) => handleKeyDown(e, "addressLine3")}
                                invalid={errors && errors.addressLine2 ? true : false}
                            />
                        </div>
                    </div>
                    <div className="col-lg-6">
                        <div className="mb-3">
                            <Label htmlFor="field" className="form-label">
                                Address Line 3
                            </Label>
                            <Input type="text" id="addressLine3" className="form-control"
                                placeholder="Enter Address Line 3" name="addressLine3"
                                onChange={(e) => handleChange("addressLine3", e.target.value)}
                                value={formData.addressLine3 || ""}
                                onKeyDown={(e) => handleKeyDown(e, "stateId")}
                                invalid={errors && errors.addressLine3 ? true : false}
                            />
                        </div>
                    </div>
                    <div className="col-lg-6">
                        <div className="mb-3">
                            <Label htmlFor="field" className="form-label">
                                State
                            </Label>
                            <Select ref={(el) => (selectRefs.current.stateId = el)} placeholder="Choose State"
                                options={stateOptions} onChange={(selected) => handleChange("stateId", selected.value)}
                                value={stateOptions.find((option) => option.value === formData.stateId) || null}
                                onKeyDown={(e) => handleKeyDown(e, "countryId")}
                                styles={{
                                    control: (provided) => ({
                                        ...provided,
                                        borderColor: errors.stateId ? "#dc3545" : "#ced4da",
                                        "&:hover": {
                                            borderColor: errors.stateId ? "#dc3545" : "#80bdff",
                                        },
                                        boxShadow: errors.stateId
                                            ? "0 0 0 0.2rem rgba(220,53,69,.25)"
                                            : "none",
                                    }),
                                }}
                            />
                            {errors.stateId && (<div className="invalid-feedback d-block">{errors.stateId}</div>)}
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="mb-3">
                            <Label htmlFor="categoryName-field" className="form-label">
                                Country
                            </Label>
                            <Select ref={(el) => (selectRefs.current.countryId = el)} placeholder="Choose Country"
                                options={countryOptions} onChange={(selected) => handleChange("countryId", selected.value)}
                                value={countryOptions.find((option) => option.value === formData.countryId) || null}
                                onKeyDown={(e) => handleKeyDown(e, "postalCode")}
                                styles={{
                                    control: (provided) => ({
                                        ...provided,
                                        borderColor: errors.countryId ? "#dc3545" : "#ced4da",
                                        "&:hover": {
                                            borderColor: errors.countryId ? "#dc3545" : "#80bdff",
                                        },
                                        boxShadow: errors.countryId
                                            ? "0 0 0 0.2rem rgba(220,53,69,.25)"
                                            : "none",
                                    }),
                                }}
                            />
                            {errors.countryId && (<div className="invalid-feedback d-block">{errors.countryId}</div>)}

                        </div>
                    </div>
                    <div className="col-lg-6">
                        <div className="mb-3">
                            <Label htmlFor="field" className="form-label">
                                Postal Code
                            </Label>
                            <Input type="number" id="postalCode" className="form-control"
                                placeholder="Enter Postal Code" name="postalCode"
                                onChange={(e) => { const value = e.target.value.slice(0, 6); handleChange("postalCode", value); }}
                                value={formData.postalCode || ""}
                                onKeyDown={(e) => restrictInvalidChars(e, "submitButton")}
                                invalid={errors && errors.postalCode ? true : false}
                            />
                        </div>
                    </div>
                    <div className="col-md-12" style={{ marginTop: "30px" }}>
                        <div className="text-end">
                            <Button type="submit" id="submitButton" className="btn btn-info" onClick={customerId ? handleUpdate : handleSubmit} disabled={loading}>
                                <span className="d-flex align-items-center">
                                    <span className="flex-grow-1 me-2">
                                        {customerId ? "Update" : "Save"}
                                    </span>
                                    {loading && (<Spinner size="sm" className="flex-shrink-0" role="status"></Spinner>)}
                                </span>
                            </Button>&nbsp;&nbsp;
                            <Button type="button" className="btn btn-danger" onClick={handleClose}>
                                Cancel
                            </Button>
                        </div>
                    </div>
                </div>
            </ModalBody>
        </Modal>
    );
};

export default CreateModal;
