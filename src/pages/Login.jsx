import { addToast, Form, Input, ScrollShadow } from "@heroui/react";
import { Checkmark12Filled, Dismiss12Filled, DismissCircleFilled, DoorArrowRightFilled, EmojiHandFilled, EyeFilled, EyeOffFilled, TextAsterisk16Filled } from "@fluentui/react-icons";
import { useState, useEffect } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import { PrimaryButton } from "../components/PrimaryButton";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.jsx";

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'https://sgi-backend-ok03.onrender.com/api').replace(/\/+$/, '')

export const Login = () => {
    const { login, user } = useAuth();
    const [isVisible, setIsVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const toggleVisibility = () => setIsVisible(!isVisible);
    const navigate = useNavigate();

    useEffect(() => {
        if (user && user.role) {
            navigate("/App")
        }
    }, [user, navigate])

    const onSubmit = async (e) => {
        e.preventDefault()
        const data = Object.fromEntries(new FormData(e.currentTarget))
        
        try {
            setIsLoading(true);

            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
                credentials: "include"
            });
            const result = await response.json()
            
            if (result && result.data && result.data.roles && result.data.roles.length > 0) {
                // Extraer el rol del array de roles
                const userRole = result.data.roles[0].authority
                login({ 
                    email: result.data.user.email, 
                    role: userRole,
                    token: result.data.token 
                });
                setIsLoading(false);
            } else {
                addToast({
                    title: "Credenciales incorrectas",
                    description: result.message,
                    color: "danger",
                    icon: <DismissCircleFilled className='size-5' />
                })
                setIsLoading(false);
            }
        } catch (err) {
            console.log(err)
            addToast({
                title: "Error de conexión con el servidor",
                description: "Lo sentimos, ocurrió un error al realizar la petición al servidor",
                color: "danger",
                icon: <DismissCircleFilled className='size-5' />
            })
            setIsLoading(false);
        }
    }

    return (
        <>
            <div className="flex flex-col w-screen h-dvh dark:sm:bg-black/20 sm:bg-black/10 transition-colors duration-1000 ease-in-out sm:p-4 sm:gap-4 overflow-hidden">
                <div className="flex flex-col flex-1 min-h-0 bg-transparent gap-4">
                    <div className="flex-1 transition-colors duration-1000 ease-in-out bg-transparent rounded-lg overflow-y-hidden">
                        <ScrollShadow className="h-full bg-transparent pl-3 pt-4 sm:py-6 xs:pl-5
                        [&::-webkit-scrollbar]:h-1
                        [&::-webkit-scrollbar]:w-1
                        [&::-webkit-scrollbar-track]:rounded-full
                        [&::-webkit-scrollbar-track]:bg-transparent
                        [&::-webkit-scrollbar-thumb]:rounded-full
                        [&::-webkit-scrollbar-thumb]:bg-primary">
                            <div className="w-full h-full flex flex-col items-center justify-center pr-3 xs:pr-5">
                                <div className="bg-background rounded-[16px] sm:shadow-large flex flex-col justify-center items-center sm:px-4 px-0 sm:py-12 py-0 -mt-10">
                                    <p className="text-lg sm:text-xl pb-4 font-semibold">Iniciar sesión</p>
                                    <p className="text-sm sm:text-base pb-12 max-w-sm text-center px-8">Ingrese sus credenciales para poder acceder a la aplicación</p>
                                    <Form className="flex gap-8 items-center w-full" onSubmit={onSubmit}>
                                        <Input
                                            label={
                                                <div className="flex justify-between">
                                                    <div className="flex items-center gap-1">
                                                        <p>Correo electrónico</p>
                                                        <TextAsterisk16Filled className="size-3 text-background-500 group-data-[focus=true]:text-primary group-data-[invalid=true]:!text-danger"/>
                                                    </div>
                                                </div>
                                            }
                                            classNames={{ label: "w-full font-medium !text-current", input: "group-data-[invalid=true]:!text-current font-medium",  mainWrapper: "group-data-[invalid=true]:animate-shake", inputWrapper: "caret-primary group-data-[invalid=true]:caret-danger bg-background-100 group-data-[hover=true]:border-background-200 group-data-[focus=true]:!border-primary group-data-[invalid=true]:!border-danger border-background-100 text-current" }}
                                            className="w-full max-w-xs"
                                            color="primary"
                                            name="email"
                                            labelPlacement="outside"
                                            type="email"
                                            radius="sm"
                                            size="md"
                                            variant="bordered"
                                            maxLength={100}
                                            placeholder="Ingresa tu correo electrónico"
                                            endContent={<> <Checkmark12Filled className='size-5 text-background-500 group-data-[focus=true]:text-primary group-data-[invalid=true]:hidden' />  <div className="hidden group-data-[invalid=true]:block "><Dismiss12Filled className='size-4 text-danger' /></div> </>}
                                            validate={(value) => {
                                                if (value.length === 0){
                                                    return "El campo es obligatorio."
                                                }
                                                
                                                if (value.length > 0 && !value.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i)){
                                                    return "Ingresa una dirección de correo electrónico valida."
                                                }
                                            }}
                                        />

                                        <Input
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
                                            className="w-full max-w-xs"
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

                                        <PrimaryButton
                                            isLoading={isLoading}
                                            startContent={!isLoading && <DoorArrowRightFilled className="size-5"/>}
                                            isSubmit={true} 
                                            label="Iniciar sesión"
                                        />
                                    </Form>
                                </div>
                            </div>
                        </ScrollShadow>
                    </div>
                </div>

                <div className="fixed bottom-0 left-0 w-full pb-4 pt-4 backdrop-blur-lg">
                    <p className="sm:text-sm text-xs text-center">© 2025 Creparis, S.A. de C.V. Todos los derechos reservados.</p>
                </div>
            </div>
        </>
    )
}