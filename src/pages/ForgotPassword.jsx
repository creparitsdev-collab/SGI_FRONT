import { ArrowHookUpLeftFilled, ArrowHookUpRightFilled, CheckmarkFilled, DismissFilled, EditFilled, EyeFilled, EyeOffFilled, TextAsteriskFilled } from "@fluentui/react-icons"
import { Button, Form, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDraggable } from "@heroui/react"
import { useRef, useState } from "react"
import { useNavigate, useParams } from "react-router"
import { isValidUUID } from "../js/validators"

export const ForgotPassword = () => {
    const [isOpen, setIsOpen] = useState(true)
    const [isLoading, setIsLoading] = useState(false)
    const [wasSent, setWasSent] = useState(false)
    const [email, setEmail] = useState("")
    const [emailError, setEmailError] = useState("")
    const [cPErrors, setCPErrors] = useState({}) 

    const [isNewPVisible, setIsNewPVisible] = useState(false)
    
    const toggleNewPVisibility = () => setIsNewPVisible(!isNewPVisible)
    
    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=[\]{}|;:,.<>?])[A-Za-z0-9!@#$%^&*()_+\-=[\]{}|;:,.<>?]{8,}$/

    const { token } = useParams()

    const targetRef = useRef(null)
    const {moveProps} = useDraggable({targetRef, isDisabled: !isOpen})

    const validateEmail = (value) => {
        if (!value || value.trim() === "") {
            return "El campo es obligatorio."
        }
        if (value !== null && !value.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i)){
            return "Ingresa una dirección de correo electrónico valida."
        }
        return ""
    }

    const handleEmailChange = (value) => {
        setEmail(value)
        setEmailError(validateEmail(value))
    }

    const onSubmit = async (e) => {
        e.preventDefault()

        const error = validateEmail(email)
        setEmailError(error)

        if (error) return
        
        const data = Object.fromEntries(new FormData(e.currentTarget))    
        
        // llamada a la api
        console.log(data)

        setWasSent(true)
    }

    const onSubmitChangePassword = async (e) => {
        e.preventDefault()

        const data = Object.fromEntries(new FormData(e.currentTarget))    
        console.log(data)
        alert(data)
    }

    return (
        <>
            {token ? (
                isValidUUID(token) 
                    ?   <Modal
                            hideCloseButton
                            size="md"
                            radius="lg"
                            isKeyboardDismissDisabled
                            isDismissable={false}
                            isOpen={isOpen}
                            onOpenChange={setIsOpen}
                            classNames={{wrapper: "overflow-hidden", backdrop: "bg-black/20"}}
                            ref={targetRef} 
                            className="my-0"
                        >
                            <ModalContent className="bg-background">
                                <ModalHeader {...moveProps} className="flex flex-col gap-2 pb-4 pt-8">
                                    <p className="text-lg font-bold text-center">Actualizar contraseña</p>
                                </ModalHeader>
                                <ModalBody className="py-0 gap-0">
                                    <p className="text-sm font-normal pb-6 text-center">Ingrese la nueva contraseña que usará para poder recuperar el acceso a la aplicación.</p>
                                    <Form onSubmit={onSubmitChangePassword} id="cp-form" className="gap-6 flex flex-col" validationErrors={cPErrors}>
                                        <input type="hidden" name="token" value={token} />
                                        <Input
                                            label={
                                                <div className="flex justify-between">
                                                    <div className="flex items-center gap-1">
                                                        <p>Nueva contraseña</p>
                                                        <TextAsteriskFilled className="size-3 text-background-500 group-data-[focus=true]:text-primary group-data-[invalid=true]:!text-danger"/>
                                                    </div>
                                                </div>
                                            }
                                            classNames={{ label: "w-full font-medium !text-current", input: "group-data-[invalid=true]:!text-current font-medium",  mainWrapper: "group-data-[invalid=true]:animate-shake", inputWrapper: "caret-primary group-data-[invalid=true]:caret-danger bg-background-100 group-data-[hover=true]:border-background-200 group-data-[focus=true]:!border-primary group-data-[invalid=true]:!border-danger border-background-100 text-current" }}
                                            className="w-full"
                                            color="primary"
                                            name="newPassword"
                                            autoComplete="new-password"
                                            labelPlacement="outside"
                                            type={isNewPVisible ? "text" : "password"}
                                            radius="sm"
                                            size="md"
                                            variant="bordered"
                                            placeholder="Ingrese la nueva contraseña"
                                            endContent={
                                                <button
                                                    aria-label="toggle password visibility"
                                                    className="focus:outline-none"
                                                    type="button"
                                                    onClick={toggleNewPVisibility}
                                                >
                                                    {isNewPVisible ? (
                                                        <EyeOffFilled className="size-5 text-background-500 group-data-[focus=true]:text-primary group-data-[invalid=true]:text-danger" />
                                                    ) : (                                        
                                                        <EyeFilled className="size-5 text-background-500 group-data-[focus=true]:text-primary group-data-[invalid=true]:text-danger" />
                                                    )}
                                                </button>
                                            }
                                            description="La contraseña debe tener al menos 8 caracteres, incluir una letra mayúscula y un carácter especial."
                                            validate={(value) => {
                                                if (!passwordRegex.test(value)) {
                                                    return "La contraseña debe tener al menos 8 caracteres, incluir una letra mayúscula y un carácter especial.";
                                                }
                                            }}
                                        />
                                    </Form>
                                </ModalBody>
                                <ModalFooter className="flex justify-center pb-8 pt-4 sm:gap-4 gap-2">
                                    <Button
                                        className="tracking-wide font-medium data-[hover=true]:-translate-y-1"
                                        form="cp-form"
                                        radius="sm"
                                        variant="shadow"
                                        color="primary"
                                        type="submit"
                                        startContent={!isLoading && <EditFilled className="size-5"/>}
                                        isLoading={isLoading}
                                    >
                                        Actualizar
                                    </Button>
                                </ModalFooter>
                            </ModalContent>
                        </Modal>  
                    :   <Modal
                            hideCloseButton
                            size="md"
                            radius="lg"
                            isKeyboardDismissDisabled
                            isDismissable={false}
                            isOpen={isOpen}
                            onOpenChange={setIsOpen}
                            classNames={{wrapper: "overflow-hidden", backdrop: "bg-black/20"}}
                            ref={targetRef} 
                            className="my-0"
                        >
                            <ModalContent className="bg-background">
                                <ModalHeader {...moveProps} className="flex flex-col gap-2 pb-4 pt-8">
                                    <p className="text-lg font-bold text-center">Token inválido</p>
                                </ModalHeader>
                                <ModalBody className="py-0 gap-0">
                                    <p className="text-sm font-normal pb-4 text-center">El token proporcionado no cuenta con un formato correcto, por favor, inténtelo de nuevo</p>
                                </ModalBody>
                                <ModalFooter className="flex justify-center pb-8 pt-4 sm:gap-4 gap-2">
                                    <Button
                                        className="tracking-wide font-medium data-[hover=true]:-translate-y-1"
                                        radius="sm"
                                        variant="shadow"
                                        color="primary"
                                        type="button"
                                        startContent={<ArrowHookUpLeftFilled className="size-5"/>}
                                        onPress={() => {window.location.replace("/ForgotPassword")}}
                                    >
                                        Volver
                                    </Button>
                                </ModalFooter>
                            </ModalContent>
                        </Modal>
            ) : (
                wasSent 
                    ?   <Modal
                            hideCloseButton
                            size="md"
                            radius="lg"
                            isKeyboardDismissDisabled
                            isDismissable={false}
                            isOpen={isOpen}
                            onOpenChange={setIsOpen}
                            classNames={{wrapper: "overflow-hidden", backdrop: "bg-black/20"}}
                            ref={targetRef} 
                            className="my-0"
                        >
                            <ModalContent className="bg-background">
                                <ModalHeader {...moveProps} className="flex flex-col gap-2 pb-4 pt-8">
                                    <p className="text-lg font-bold text-center">Correo electrónico enviado</p>
                                </ModalHeader>
                                <ModalBody className="py-0 gap-0">
                                    <p className="text-sm font-normal pb-4 text-center">Revise la bandeja de entrada de su correo electrónico e ingrese al link proporcionado dentro del mensaje que le enviamos. Ya puede cerrar esta pestaña</p>
                                </ModalBody>
                                <ModalFooter className="flex justify-center pb-8 pt-4 sm:gap-4 gap-2">
                                    <Button
                                        className="tracking-wide font-medium data-[hover=true]:-translate-y-1"
                                        radius="sm"
                                        variant="shadow"
                                        type="button"
                                        color="primary"
                                        startContent={<ArrowHookUpLeftFilled className="size-5"/>}
                                        onPress={() => {window.location.reload(true)}}
                                    >
                                        Volver
                                    </Button>
                                </ModalFooter>
                            </ModalContent>
                        </Modal>
                    :   <Modal
                            hideCloseButton
                            size="md"
                            radius="lg"
                            isKeyboardDismissDisabled
                            isDismissable={false}
                            isOpen={isOpen}
                            onOpenChange={setIsOpen}
                            classNames={{wrapper: "overflow-hidden", backdrop: "bg-black/20"}}
                            ref={targetRef} 
                            className="my-0"
                        >
                            <ModalContent className="bg-background">
                                <ModalHeader {...moveProps} className="flex flex-col gap-2 pb-4 pt-8">
                                    <p className="text-lg font-bold text-center">Restablecer contraseña</p>
                                </ModalHeader>
                                <ModalBody className="py-0 gap-0">
                                    <p className="text-sm font-normal pb-6 text-center">Ingrese su correo electrónico de acceso para enviarle un enlace seguro para cambiar su contraseña. El enlace caduca por seguridad.</p>
                                    <Form onSubmit={onSubmit} id="form" className="gap-6 flex flex-col">
                                        <Input
                                            label={
                                                <div className="flex justify-between">
                                                    <div className="flex items-center gap-1">
                                                        <p className="font-medium text-sm">Correo electrónico</p>
                                                        <TextAsteriskFilled className="size-3 text-background-500 group-data-[focus=true]:text-primary group-data-[invalid=true]:!text-danger"/>
                                                    </div>
                                                </div>
                                            }
                                            autoComplete="email"
                                            classNames={{ label: "w-full font-medium !text-current transition-colors !duration-1000 ease-in-out", input: "transition-colors !duration-1000 ease-in-out group-data-[invalid=true]:!text-current font-medium !placeholder-background-500 placeholder:!font-normal",  mainWrapper: "group-data-[invalid=true]:animate-shake", inputWrapper: "transition-colors !duration-1000 ease-in-out caret-primary group-data-[invalid=true]:caret-danger bg-background-100 group-data-[hover=true]:border-background-200 group-data-[focus=true]:!border-primary group-data-[invalid=true]:!border-danger border-transparent text-current" }}
                                            className="w-full"
                                            color="primary"
                                            name="email"
                                            labelPlacement="outside"
                                            type="email"
                                            radius="sm"
                                            size="md"
                                            variant="bordered"
                                            maxLength={50}
                                            placeholder="Ingrese su correo electrónico"
                                            value={email}
                                            onValueChange={handleEmailChange}
                                            isInvalid={!!emailError}
                                            errorMessage={emailError}
                                        />
                                    </Form>
                                </ModalBody>
                                <ModalFooter className="flex justify-center pb-8 pt-4 sm:gap-4 gap-2">
                                    <Button
                                        className="tracking-wide font-medium data-[hover=true]:-translate-y-1"
                                        form="form"
                                        radius="sm"
                                        variant="shadow"
                                        color="primary"
                                        type="submit"
                                        startContent={!isLoading && <ArrowHookUpRightFilled className="size-5"/>}
                                        isLoading={isLoading}
                                        isDisabled={!!emailError}
                                    >
                                        Siguiente
                                    </Button>
                                </ModalFooter>
                            </ModalContent>
                        </Modal>  
            )}
        </>
    )
}