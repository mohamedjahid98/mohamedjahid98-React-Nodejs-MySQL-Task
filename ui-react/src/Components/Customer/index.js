/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useMemo, useState, useEffect } from "react";
import { Card, CardHeader, Col, Container, Row, Button, Spinner, Table, Pagination, PaginationItem, PaginationLink } from "reactstrap";
import { shallowEqual, useSelector, useDispatch } from "react-redux";
import { createSelector } from "reselect";
import { Alert } from "../../common/SwalAlert";
import CreateModal from "./create";
import DeleteModal from "./delete";
import { getCustomerList, getCustomer, resetCustomerFlag, deleteCustomer } from "../../Redux/thunks";

function CustomerList() {
  const dispatch = useDispatch();
  const [customerList, setCustomerList] = useState([]);
  const [customerData, setCustomerData] = useState("");
  const [customerId, setCustomerId] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDelete] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 5,
    totalRecords: 0,
    totalDisplayRecords: 0,
  });

  const selectLayoutState = (state) => state.Customer;
  const selectLayoutProperties = createSelector(selectLayoutState, (layout) => {
    if (!layout) return {};
    return {
      customer: layout.customer,
      customers: layout.customers,
      isCustomerCreated: layout.isCustomerCreated,
      isCustomerDeleted: layout.isCustomerDeleted,
      isCustomerFail: layout.isCustomerFail,
      isLoading: layout.isLoading,
      isGetLoading: layout.isGetLoading,
      error: layout.error,
    };
  });
  const totalPages = Math.ceil(pagination.totalDisplayRecords / pagination.pageSize);

  const { customer, customers, isCustomerCreated, isCustomerDeleted, isCustomerFail } = useSelector(selectLayoutProperties, shallowEqual);

  useEffect(() => {
    if (isCustomerCreated) {
      Alert({
        icon: "success",
        title: "Success!",
        message: "Customer saved successfully.",
        confirmButtonText: "OK",
        isDispatch: true,
        onFunction: () => dispatch(resetCustomerFlag()),
      });
    }
    if (isCustomerDeleted) {
      Alert({
        icon: "success",
        title: "Success!",
        message: "Customer deleted successfully.",
        confirmButtonText: "OK",
        isDispatch: true,
        onFunction: () => dispatch(resetCustomerFlag()),
      });
    }
    if (isCustomerFail) {
      Alert({
        icon: "error",
        title: "Error!",
        message: "Customer Failed!.",
        confirmButtonText: "OK",
        isDispatch: true,
        onFunction: () => dispatch(resetCustomerFlag()),
      });
    }
  }, [dispatch, isCustomerCreated, isCustomerDeleted, isCustomerFail]);

  useEffect(() => {
    setPagination((prev) => {
      return {
        ...prev,
        totalRecords: customers?.totalRecords || 0,
        totalDisplayRecords: customers?.totalDisplayRecords || 0,
      };
    });
    setCustomerList((customers && customers.list) ? customers.list : []);
  }, [customers]);

  useEffect(() => {
    if (customer) {
      setCustomerData(customer.data);
    }
  }, [customer]);

  useEffect(() => {
    getCustomersList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.page, pagination.pageSize]);

  const getCustomersList = () => {
    dispatch(
      getCustomerList({
        page: pagination.page,
        displayLength: pagination.pageSize,
        search: "",
        totalRecords: pagination.totalRecords,
        totalDisplayRecords: pagination.totalDisplayRecords,
      })
    );
  };

  const handlePagination = ({ page }) => {
    setPagination((prev) => {
      return { ...prev, page, };
    });
  };

  const handlePageSize = (pageSize) => {
    setPagination((prev) => {
      return { ...prev, pageSize, };
    });
  };

  const handleShowDelete = (row) => {
    setCustomerId(row.id);
    setShowDelete(!showDeleteModal);
  };

  const handleDelete = () => {
    dispatch(deleteCustomer({ id: customerId, pagination, }));
    setShowDelete(false);
  };

  const handleShowAddModal = () => {
    dispatch(resetCustomerFlag());
    setCustomerData("");
    setShowAddModal(!showAddModal);
  };
  const columns = useMemo(
    () => [
      {
        header: "No",
        accessor: "id",
        cell: (row, rowIndex) => (
          <span>
            {rowIndex + 1 + (pagination.page - 1) * pagination.pageSize}
          </span>
        ),
      },
      {
        header: "Customer Name",
        accessor: "customerName",
      },
      {
        header: "Contact",
        accessor: "contactNo",
      },
      {
        header: "Address",
        accessorKey: "postalCode",
        enableColumnFilter: false,
        cell: (row) => {
          const { addressLine1, addressLine2, addressLine3, stateId, countryId, postalCode, } = row;

          const isAllValuesEmpty = !addressLine1 && !addressLine2 && !addressLine3 && !countryId && !stateId && !postalCode;

          return (
            <>
              {isAllValuesEmpty ? (<span className="center-text">-</span>
              ) : (
                <>
                  {(addressLine1 || addressLine2 || addressLine3) && (
                    <span>
                      {addressLine1} {addressLine2} {addressLine3}, <br />
                    </span>
                  )}

                  {(stateId || countryId || postalCode) && (
                    <span>
                      {stateId}, {countryId} - {postalCode}
                    </span>
                  )}
                </>
              )}
            </>
          );
        },
      },
      {
        header: "Action",
        cell: (row) => (
          <div style={{ cursor: "pointer", paddingLeft: "25%" }}>
            <ul className="list-inline hstack gap-2 mb-0">
              <li className="list-inline-item edit">
                <a onClick={() => handleEdit(row)} className="text-primary" title="Edit">
                  <i className="ri-pencil-fill fs-16"></i>
                </a>
              </li>
              <li className="list-inline-item">
                <a onClick={() => handleShowDelete(row)} className="text-danger" title="Delete">
                  <i className="ri-delete-bin-5-fill fs-16"></i>
                </a>
              </li>
            </ul>
          </div>
        ),
      }

    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [pagination.page, pagination.pageSize]
  );
  const handleEdit = (row) => {
    dispatch(getCustomer({ id: row.id }));
    setShowAddModal(!showAddModal);
  };

  const onClose = () => {
    setShowDelete(false);
  };
  return (
    <Container fluid>
      <div className='float-end'>
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">Home</li>
            <li className="breadcrumb-item active" aria-current="page">Customer</li>
          </ol>
        </nav>
      </div>
      <Row >
        <Col lg={12} className="mt-5">
          <Card>
            <CardHeader>
              <Row>
                <Col className="d-flex justify-content-start">
                  <h5 className="mb-0">Customer List</h5>
                </Col>
                <Col className="d-flex justify-content-end">
                  <Button color="primary" className="add-btn" onClick={handleShowAddModal} id="create-btn" >
                    <i className="ri-add-line align-bottom"></i> Add
                  </Button>
                </Col>
              </Row>
            </CardHeader>
          </Card>
          <div className="mt-5">
            {customers?.loading ? (
              <div className="text-center"><Spinner /></div>
            ) : (
              <div className="">
                <Table className="table table-bordered table-hover">
                  <thead className="table-light">
                    <tr>
                      {columns.map((col, index) => (
                        <th key={index}>{col.header}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {customerList.length ? (
                      customerList.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                          {columns.map((col, colIndex) => (
                            <td key={colIndex}>
                              {col.cell ? col.cell(row, rowIndex) : row[col.accessor]}
                            </td>
                          ))}
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={columns.length} className="text-center">
                          No data available.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
                <Row className="mt-3">
                  <Col>
                    <span className="me-2">Rows per page:</span>
                    <select value={pagination.pageSize} onChange={(e) => handlePageSize(parseInt(e.target.value))} >
                      <option value={5}>5</option>
                      <option value={10}>10</option>
                      <option value={20}>20</option>
                      <option value={50}>50</option>
                    </select>
                  </Col>

                  <Col className="d-flex justify-content-end align-items-center">

                    <Pagination>
                      <PaginationItem disabled={pagination.page === 1}>
                        <PaginationLink previous onClick={() => handlePagination({ page: pagination.page - 1 })} />
                      </PaginationItem>
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
                        <PaginationItem key={pageNumber} active={pagination.page === pageNumber} >
                          <PaginationLink onClick={() => handlePagination({ page: pageNumber })} >
                            {pageNumber}
                          </PaginationLink>
                        </PaginationItem>
                      ))}

                      <PaginationItem disabled={pagination.page === totalPages || totalPages === 0}>
                        <PaginationLink next onClick={() => handlePagination({ page: pagination.page + 1 })} />
                      </PaginationItem>
                    </Pagination>
                  </Col>
                </Row>
              </div>
            )}
          </div>
        </Col>
      </Row>

      {showAddModal && (
        <CreateModal showModal={showAddModal} customerData={customerData}
          pagination={pagination} onShowAddModal={handleShowAddModal}
        />
      )}
      {showDeleteModal && (
        <DeleteModal show={showDeleteModal}
          onDeleteClick={handleDelete} onCloseClick={onClose}
        />
      )}
    </Container>
  )
}

export default CustomerList
