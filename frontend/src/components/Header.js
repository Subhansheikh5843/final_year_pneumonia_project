import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { Link, useNavigate } from "react-router-dom";
import { userLogout } from "../store/slices/userSlice";
import { useDispatch, useSelector } from "react-redux";
import './css/Header.css'


const Header = () => {
  const dispatch = useDispatch();
  const { userInfo, loading, error } = useSelector((state) => state.userLogin);
  const navigate = useNavigate();
  const logoutHandler = () => {
    dispatch(userLogout());
    navigate("/login");
  };

  return (
    <div>
      <Navbar
        expand="lg"
        className="bg-body-tertiary main-head"
      >
        <Container>
          <Navbar.Brand as={Link} to="/">
            AUTOMATED MEDICAL DIAGNOSIS
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              {userInfo ? (
                <>
                  <Nav.Link as={Link} to="/">
                    <i className="fas fa-home"></i> Home
                  </Nav.Link>
                  <Nav.Link as={Link} to="/about">
                  <i class="fa-solid fa-file-contract"></i> About
                  </Nav.Link>

                  <NavDropdown
                    title={
                      <>
                        <i className="fa-solid fa-disease"></i> Services
                      </>
                    }
                    id="basic-nav-dropdown"
                  >
                    <NavDropdown.Item as={Link} to="/pneumonia">
                      
                      Pneumonia
                    </NavDropdown.Item>
 
                    <NavDropdown.Item as={Link} to="/chatbot">
                    
                    Chatbot
                    </NavDropdown.Item>


                    <NavDropdown.Divider />
                  </NavDropdown>

                  <Nav.Link as={Link} to="/contact">
                  <i class="fa-solid fa-phone-volume"></i> Contact
                  </Nav.Link>

                  <Nav.Link onClick={logoutHandler}>
                    <i class="fa-solid fa-right-from-bracket"></i> Logout
                  </Nav.Link>
                  <Nav.Link className="right">
                    <i className="fas fa-user"></i>{" "}
                    {userInfo?.data?.user["name"]}
                  </Nav.Link>
                </>
              ) : (
                <>
                  <Nav.Link as={Link} to="/login">
                    <i className="fas fa-user"></i>Login
                  </Nav.Link>
                  <Nav.Link as={Link} to="/register">
                    <i className="fas fa-user"></i>Register
                  </Nav.Link>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  );
};

export default Header;


