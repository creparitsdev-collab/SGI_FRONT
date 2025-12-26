import { addToast, Form, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDraggable } from '@heroui/react';
import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { PrimaryButton } from '../components/PrimaryButton';
import { CheckmarkCircleFilled, DismissCircleFilled, DoorArrowLeftFilled, DoorArrowRightFilled, EyeFilled, EyeOffFilled, PersonArrowLeftFilled, PersonArrowRightFilled, TextAsterisk16Filled } from '@fluentui/react-icons';
import { Link, useLocation, useNavigate } from 'react-router';
import { SecondaryButton } from '../components/SecondaryButton';
import { useIsIconOnlySmall } from './useIsIconOnly';

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'https://sgi-backend-ok03.onrender.com/api').replace(/\/+$/, '')

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // Leer usuario de localStorage al iniciar
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  })

  let navigate = useNavigate()
  const location = useLocation()

  const isIconOnly = useIsIconOnlySmall()
  const [isOpen, setIsOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);

  const [errors, setErrors] = useState({})

  const targetRef = useRef(null)
  const {moveProps} = useDraggable({targetRef, isDisabled: !isOpen})

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  useEffect(() => {
    const handler = () => {
      setIsOpen(true)
    }
    window.addEventListener('sessionExpired', handler)
    return () => window.removeEventListener('sessionExpired', handler)
  }, [])

  const onSubmit = async (e) => {
    e.preventDefault()
    const data = Object.fromEntries(new FormData(e.currentTarget))
        
    try {
      setIsLoading(true)

      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include"
      })

      const result = await response.json()
      
      if (result && result.data && result.data.roles && result.data.roles.length > 0) {
        const userRole = result.data.roles[0].authority
        setUser({ 
          email: result.data.user.email, 
          role: userRole,
          token: result.data.token 
        })
        setIsLoading(false)
        setIsOpen(false)
      } else {
        addToast({
          title: "Contraseña incorrecta",
          description: "La contraseña no es valida. Por favor, verifique su contraseña",
          color: "danger",
          icon: <DismissCircleFilled className='size-5' />
        })
        setErrors({password: "Contraseña incorrecta. Vuelve a intentarlo"})
        setIsLoading(false)
      }
    } catch (err) {
      console.log(err)
      addToast({
        title: "Error de conexión con el servidor",
        description: "Lo sentimos, ocurrió un error al realizar la petición al servidor. Intentelo de nuevo más tarde",
        color: "danger",
        icon: <DismissCircleFilled className='size-5' />
      })
      setIsLoading(false);
    }

    window.dispatchEvent(new Event('clearSearch'))

    if (location.pathname === "/App") window.location.reload(true)
  }

  const login = (userData) => {
    setUser(userData);
    // localStorage se actualiza por useEffect
  };

  const logout = async () => {
    setUser(null);
    localStorage.removeItem('user');
    // Si tu backend tiene endpoint de logout, descomenta:
    // await fetch('https://labmetricas-backend.onrender.com/api/auth/logout', { method: 'POST', credentials: 'include' });
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
    setIsOpen(false)
    setIsLoading(false)
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}

      {user && (
        <Modal
          isOpen={isOpen} 
          onOpenChange={setIsOpen}
          ref={targetRef} 
          isDismissable={false}
          isKeyboardDismissDisabled
          hideCloseButton
          className="bg-background my-0"
          size="md"
          backdrop="blur"
        >
          <ModalContent>
            <ModalHeader {...moveProps} className="flex flex-col py-4">
              <p className="text-lg font-bold text-center pt-5">La sesión ha expirado</p>
            </ModalHeader>
            <ModalBody className='py-0 gap-0'>
              <p className="text-center">Vuelva a ingresar su contraseña de acceso para continuar como: <span className='font-medium'>{user.email}</span></p>

              <Form className="pt-6 flex items-center w-full" onSubmit={onSubmit} validationErrors={errors}>
                <input type="hidden" name="email" value={user.email} />

                <Input
                  autoFocus
                  autoComplete='current-password'
                  label={
                      <div className="flex justify-between">
                          <div className="flex items-center gap-1">
                              <p>Contraseña</p>
                              <TextAsterisk16Filled className="size-3 text-background-500 group-data-[focus=true]:text-primary group-data-[invalid=true]:!text-danger"/>
                          </div>
                          <Link className="text-secondary font-medium text-sm" to="/ForgotPassword">¿Olvidó su contraseña?</Link>
                      </div>
                  }
                  classNames={{ label: "w-full font-medium !text-current", input: "group-data-[invalid=true]:!text-current font-medium",  mainWrapper: "group-data-[invalid=true]:animate-shake", inputWrapper: "caret-primary group-data-[invalid=true]:caret-danger bg-background-100 group-data-[hover=true]:border-background-200 group-data-[focus=true]:!border-primary group-data-[invalid=true]:!border-danger border-background-100 text-current" }}
                  className="w-full"
                  color="primary"
                  name="password"
                  labelPlacement="outside"
                  type={isVisible ? "text" : "password"}
                  radius="sm"
                  size="md"
                  variant="bordered"
                  placeholder="Ingresa tu contraseña"
                  endContent={
                      <button
                          aria-label="toggle password visibility"
                          className="focus:outline-none"
                          type="button"
                          onClick={toggleVisibility}
                      >
                          {isVisible ? (
                              <EyeOffFilled className="size-5 text-background-500 group-data-[focus=true]:text-primary group-data-[invalid=true]:text-danger" />
                          ) : (                                        
                              <EyeFilled className="size-5 text-background-500 group-data-[focus=true]:text-primary group-data-[invalid=true]:text-danger" />
                          )}
                      </button>
                  }
                  validate={(value) => {
                      if (value.length === 0){
                          return "El campo es obligatorio."
                      }
                  }}
                />

                <div className='pt-4 pb-8 flex sm:gap-4 gap-2 w-full justify-center'>
                  <SecondaryButton
                    onPress={handleLogout}
                    label="Cerrar sesión"
                    startContent={<DoorArrowLeftFilled className="size-5"/>}
                  />
                  
                  <PrimaryButton
                    isLoading={isLoading}
                    isSubmit={true} 
                    label="Continuar"
                    startContent={<DoorArrowRightFilled className="size-5"/>}
                  />
                </div>
              </Form>
            </ModalBody>
          </ModalContent>
        </Modal>
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext); 