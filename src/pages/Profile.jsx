import { addToast, Button, Card, CardBody, Drawer, DrawerBody, DrawerContent, DrawerHeader, Form, Input, InputOtp, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ScrollShadow, Spinner as SpinnerH, useDraggable } from "@heroui/react";
import { ArrowLeftStartOnRectangleIcon, EnvelopeIcon, EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import { PrimaryButton } from "../components/PrimaryButton"
import { use, useEffect, useRef, useState, useTransition } from "react";
import { Checkmark12Filled, CheckmarkCircleFilled, CheckmarkFilled, CloudArrowUpFilled, Dismiss12Filled, DismissCircleFilled, DismissFilled, DoorArrowLeftFilled, EditFilled, EyeFilled, EyeOffFilled, KeyMultipleFilled, KeyResetFilled, PersonEditFilled, SaveFilled, TextAsterisk16Filled, TextAsteriskFilled } from "@fluentui/react-icons";
import { motion } from "framer-motion"
import { SecondaryButton } from "../components/SecondaryButton";
import { changePassword, getProfile, getUsers, updateProfile, updateUser } from "../service/user";
import { onlyLetters, required, validEmail, validPhone } from "../js/validators";
import { LogOutModal } from "../layouts/AppLayout";
import { Tooltip } from "../components/Tooltip";
import { CloseButton } from "../components/CloseButton";
import { Link } from "react-router";

export const Profile = ({isOpen, onOpenChange}) => {
    const [isLogoutOpen, setIsLogoutOpen] = useState(false)
    const [isCPOpen, setIsCPOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    
    const [refreshTrigger, setRefreshTrigger] = useState(false)
    const triggerRefresh = () => setRefreshTrigger(prev => !prev)

    const [errors, setErrors] = useState([])
    const [cPErrors, setCPErrors] = useState({})

    const [, startTransition] = useTransition()

    const [profile, setProfile] = useState({})

    const [isUpdating, setIsUpdating] = useState(false)
    
    const targetRef = useRef(null)
    const {moveProps} = useDraggable({targetRef, isDisabled: !isCPOpen})
    
    const [isVisible, setIsVisible] = useState(false)
    const [isNewPVisible, setIsNewPVisible] = useState(false)

    const toggleVisibility = () => setIsVisible(!isVisible)
    const toggleNewPVisibility = () => setIsNewPVisible(!isNewPVisible)

    const [isCPLoading, setIsCPLoading] = useState(false);

    const [profileFormData, setProfileFormData] = useState({
        id: profile?.id || "",
        name: profile?.name || "",
        email: profile?.email || "",
        position: profile?.position || "",
        phone: profile?.phone || "",
    })

    const [profileErrors, setProfileErrors] = useState({ 
        name: [],
        email: [],
        position: [],
        phone: [],
    })

    useEffect(() => {
        setProfileFormData({
            id: profile?.id || "",
            name: profile?.name || "",
            email: profile?.email || "",
            position: profile?.position || "",
            phone: profile?.phone || "",
        })

        setProfileErrors({
            name: [],
            email: [],
            position: [],
            phone: [],
        })
    }, [profile])

    const validators = {
        name: [required, onlyLetters],
        email: [validEmail],
        position: [required, onlyLetters],
        phone: [validPhone],
    }

    const runValidators = (value, fns) => fns.map(fn => fn(value)).filter(Boolean)

    const handleInputChange = (field, value) => {
        setProfileFormData(prev => ({ ...prev, [field]: value }))

        const fns = validators[field] || []
        const errs = runValidators(value, fns)
        setProfileErrors(prev => ({ ...prev, [field]: errs }))
    }

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setIsLoading(true)
                
                const response = await getProfile()
                const data = response.data
            
                if (data) {
                    startTransition(() => {
                        setProfile(data)
                        setIsLoading(false)
                    })
                } else {
                    addToast({
                        title: "No se pudo obtener el perfil",
                        description: "Ocurrió un error al obtener el perfil",
                        color: "danger",
                        icon: <DismissCircleFilled className='size-5' />
                    })
                    startTransition(() => {
                        setErrors(prev => [...prev, "No se pudo obtener el perfil"])
                        setIsLoading(false)
                    })
                }
            } catch (err) {
                startTransition(() => {
                    setErrors(prev => [...prev, err.message])
                    setIsLoading(false)
                })
            }
        }
        fetchProfile()
    }, [refreshTrigger, isOpen])

    const onSubmit = async (e) => {
        e.preventDefault()

        const formEntries = Object.fromEntries(new FormData(e.currentTarget))
        
        const formData = { id: profile.id, roleId: profile.roleName === "ADMIN" ? 1 : profile.roleName === "SUPERVISOR" ? 2 : 3, ...formEntries }

        try {
            setIsLoading(true)

            const response = await getUsers()
            const users = response.data

            const exists = users.find(
                (u) => u.email.trim().toLowerCase() === formData.email.trim().toLowerCase()
            )
            
            if (exists && (exists.id !== formData.id)) {
                setProfileErrors((prev) => ({
                    ...prev,
                    email: ["El correo electrónico ingresado ya está en uso."],
                }))
                addToast({
                    title: "El correo electrónico ingresado ya está en uso.",
                    description: "Por favor, ingrese uno distinto.",
                    color: "danger",
                    icon: <DismissCircleFilled className="size-5"/>
                })
                return
            }

            try {
                setIsLoading(true)
                const response = await updateProfile(formData)

                const success = response.type === "SUCCESS"
                
                addToast({
                    title: success ? "Se actualizó su perfil correctamente" : "No se actualizó su perfil",
                    description: success ? "Los cambios se han guardado" : "Ocurrió un problema al guardar los cambios. Por favor, inténtelo de nuevo",
                    color: success ? "primary" : "danger",
                    icon: success
                        ? <CheckmarkCircleFilled className="size-5"/>
                        : <DismissCircleFilled className="size-5"/>
                })

                if (success){ triggerRefresh(); setIsUpdating(false); window.dispatchEvent(new CustomEvent('profileUpdated'));}
            } catch (error){
                addToast({
                    title: "No se actualizó su perfil",
                    description: error.response.data.message,
                    color: "danger",
                    icon: <DismissCircleFilled className="size-5"/>
                })
            } finally {
                setIsLoading(false)
            }
            setProfileErrors({ name: [], email: [], position: [], phone: [], roleId: [] })
        } catch (error) {
            addToast({
                title: `No se pudo verificar el correo. Intenta de nuevo.`,
                description: error.response.data.message,
                color: "danger",
                icon: <DismissCircleFilled className="size-5"/>
            })
            return
        } finally {
            setIsLoading(false)
        }
    }

    const onSubmitCP = async (e) => {
        e.preventDefault()

        const formEntries = Object.fromEntries(new FormData(e.currentTarget))
    
        try {
            setIsCPLoading(true)
            
            const response = await changePassword(formEntries)

            const success = response.type === "SUCCESS"
            
            addToast({
                title: success
                    ? `Se actualizó su contraseña correctamente`
                    : `No se actualizó su contraseña`,
                description: `Para ingresar nuevamente a la aplicación, use la contraseña nueva`,
                color: success ? "primary" : "danger",
                icon: success
                    ? <CheckmarkCircleFilled className="size-5"/>
                    : <DismissCircleFilled className="size-5"/>
            })

            if (success){triggerRefresh()}
        } catch (error){
            if (error.response.data.message == "Current password is incorrect"){
                addToast({
                    title: `No se actualizó su contraseña`,
                    description: "La contraseña actual es incorrecta. Por favor, verifique que sea válida",
                    color: "danger",
                    icon: <DismissCircleFilled className="size-5"/>
                })
                setCPErrors({currentPassword: "Contraseña incorrecta. Vuelva a intentarlo"})
            } else {
                addToast({
                    title: `No se actualizó su contraseña`,
                    description: error.response.data.message,
                    color: "danger",
                    icon: <DismissCircleFilled className="size-5"/>
                })
            }
        } finally {
            setIsCPLoading(false)
            setIsCPOpen(false)
        }
    }

    const passwordRegex =
  /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=[\]{}|;:,.<>?])[A-Za-z0-9!@#$%^&*()_+\-=[\]{}|;:,.<>?]{8,}$/;

    return (
        <>
            <Drawer
                hideCloseButton
                size="sm"
                radius="sm"
                isOpen={isOpen} 
                onOpenChange={onOpenChange}
                backdrop="blur"
                classNames={{wrapper: "!h-[100dvh]"}}
                motionProps={{ 
                    variants: {
                        enter: {
                            x: 0,
                            opacity: 1,
                            transition: {
                                x: { type: "spring", stiffness: 300, damping: 30 },
                                opacity: { duration: 0.2 }
                            }
                        },
                        exit: {
                            x: 100,
                            opacity: 0,
                            transition: {
                                duration: 0.3,
                                ease: "easeIn"
                            }
                        }
                    }
                }}
            >
                <DrawerContent className="bg-background">
                    {(onClose) => (
                        <>
                        {!isLoading && !errors.length > 0 && (
                        <DrawerHeader className="flex flex-col gap-2 pb-8">
                            <div className="w-full flex justify-between pt-4 pb-2">
                                <p className="text-lg font-bold">Mi perfil</p>
                                <CloseButton onPress={onClose}/>     
                            </div>

                            <div className="flex">
                                <p className="text-sm font-normal">{isUpdating ? "Actualice la información necesaria y guarde los cambios" : "Revise su información completa"}</p>

                                <div className="flex gap-2 sm:gap-4">
                                    <Tooltip
                                        tooltipPlacement="top"
                                        tooltipContent="Cambiar contraseña"
                                    >
                                        <Button
                                            className="bg-transparent dark:bg-background-100 transition-background !duration-1000 ease-in-out"
                                            radius="sm"
                                            isIconOnly
                                            onPress={() => setIsCPOpen(true)}
                                        >
                                            {<KeyMultipleFilled className="size-5"/>}
                                        </Button>
                                    </Tooltip>
                                    {!isUpdating && (
                                        <Button
                                        className="tracking-wide font-medium data-[hover=true]:-translate-y-1 n9"
                                        radius="sm"
                                        variant="shadow"
                                        color="primary"
                                        onPress={() => setIsUpdating(true)}
                                        startContent={<PersonEditFilled className="size-5 mr-1" />}
                                        >
                                            Actualizar
                                        </Button>
                                    )}

                                    {/* Botón para guardar cambios (submit) */}
                                    {isUpdating && (
                                        <Button
                                            className="tracking-wide font-medium data-[hover=true]:-translate-y-1 n9"
                                            form="user-form"
                                            radius="sm"
                                            variant="shadow"
                                            color="primary"
                                            type="submit"
                                            startContent={!isLoading && <CloudArrowUpFilled className="size-5" />}
                                            isLoading={isLoading}
                                            isDisabled={
                                                profileFormData.name === "" ||
                                                profileFormData.email === "" ||
                                                profileFormData.position === "" ||
                                                profileErrors.name.length > 0 ||
                                                profileErrors.email.length > 0 ||
                                                profileErrors.position.length > 0 ||
                                                profileErrors.phone.length > 0
                                            }
                                        >
                                            Guardar
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </DrawerHeader>
                        )}
                        <DrawerBody className="h-full flex flex-col justify-between [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-primary">
                            {isLoading ? (
                                <div className="relative w-full h-full flex flex-col pt-2 gap-2">
                                    <div className="w-full flex justify-between pt-4 pb-2">
                                        <p className="text-lg font-bold">Mi perfil</p>
                                        <CloseButton onPress={onClose}/>     
                                    </div>       
                        
                                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                        <SpinnerH
                                            classNames={{ label: "pt-2 text-sm" }}
                                            color="current"
                                            size="md"
                                            label="Espere un poco por favor"
                                        />
                                    </div>
                                </div>
                            ) : ( errors.length > 0 ? (
                                <div className="relative w-full h-full flex flex-col pt-2 gap-2">
                                    <div className="w-full flex justify-between pt-4 pb-2">
                                        <p className="text-lg font-bold">Mi perfil</p>
                                        <CloseButton onPress={onClose}/>     
                                    </div>     
                                    
                                    <div className="space-y-4 pt-4">
                                        {errors.map((msg, i) => (
                                        <motion.div
                                            key={i} 
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.3, delay: i * 0.05 }}
                                        >
                                            <div key={i} className="bg-danger-50 rounded-lg border-danger-100 border py-4 px-3 flex gap-3">
                                                <div className="flex items-center justify-center text-danger-600">
                                                    <DismissCircleFilled className="size-5" />
                                                </div>
                                                <div className="text-sm text-danger-600">
                                                    <p className="font-medium break-words">{msg}</p>
                                                </div>
                                            </div>
                                        </motion.div>
                                        ))}
                                    </div>
                                </div>
                            ) : ( profile && ( 
                                <>
                                <Form onSubmit={onSubmit} id="user-form" className="gap-6 flex flex-col n3">
                                    <Input
                                        label={
                                            <div className="flex justify-between">
                                                <div className="flex items-center gap-1">
                                                    <p className="font-medium text-sm">Nombre</p>
                                                    <TextAsteriskFilled className="size-3 text-background-500 group-data-[focus=true]:text-primary group-data-[invalid=true]:!text-danger"/>
                                                </div>
                                                <p className="!text-background-500 text-xs font-normal">{profileFormData.name.length + " / 50"}</p>
                                            </div>
                                        }
                                        autoComplete="given-name"
                                        classNames={{ label: "w-full font-medium !text-current transition-colors !duration-1000 ease-in-out", input: "transition-colors !duration-1000 ease-in-out group-data-[invalid=true]:!text-current font-medium !placeholder-background-500 placeholder:!font-normal",  mainWrapper: "group-data-[invalid=true]:animate-shake", inputWrapper: "transition-colors !duration-1000 ease-in-out caret-primary group-data-[invalid=true]:caret-danger bg-background-100 group-data-[hover=true]:border-background-200 group-data-[focus=true]:!border-primary group-data-[invalid=true]:!border-danger border-transparent text-current" }}
                                        className="w-full"
                                        color="primary"
                                        name="name"
                                        labelPlacement="outside"
                                        type="text"
                                        radius="sm"
                                        size="md"
                                        variant="bordered"
                                        maxLength={50}
                                        isReadOnly={!isUpdating}
                                        placeholder={profile.name}
                                        value={profileFormData.name}
                                        onValueChange={(value) => handleInputChange('name', value)}
                                        isInvalid={profileErrors.name.length > 0}
                                        endContent={profileErrors.name.length === 0 ? <CheckmarkFilled className='size-4 text-background-500 group-data-[focus=true]:text-primary' /> : <DismissFilled className='size-4 text-danger' /> }
                                        errorMessage={() => (
                                            <div className="flex text-danger">
                                                <ul>
                                                    {profileErrors.name.map((error, i) => (
                                                        <li key={i}>{error}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    />

                                    <Input
                                        label={
                                            <div className="flex justify-between">
                                                <div className="flex items-center gap-1">
                                                    <p className="font-medium text-sm">Correo electrónico</p>
                                                    <TextAsteriskFilled className="size-3 text-background-500 group-data-[focus=true]:text-primary group-data-[invalid=true]:!text-danger"/>
                                                </div>
                                                <p className="!text-background-500 text-xs font-normal">{profileFormData.email.length + " / 50"}</p>
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
                                        isReadOnly
                                        description={<p className="text-background-500 text-xs">Si necesita actualizar su correo electrónico, contacte a algún administrador para realizar la modificación</p>}
                                        placeholder={profile.email}
                                        value={profileFormData.email}
                                        onValueChange={(value) => handleInputChange('email', value)}
                                        isInvalid={profileErrors.email.length > 0}
                                        endContent={profileErrors.email.length === 0 ? <CheckmarkFilled className='size-4 text-background-500 group-data-[focus=true]:text-primary' /> : <DismissFilled className='size-4 text-danger' /> }
                                        errorMessage={() => (
                                            <div className="flex text-danger">
                                                <ul>
                                                    {profileErrors.email.map((error, i) => (
                                                        <li key={i}>{error}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    />

                                    <Input
                                        label={
                                            <div className="flex justify-between">
                                                <div className="flex items-center gap-1">
                                                    <p className="font-medium text-sm">Puesto</p>
                                                    <TextAsteriskFilled className="size-3 text-background-500 group-data-[focus=true]:text-primary group-data-[invalid=true]:!text-danger"/>
                                                </div>
                                                <p className="!text-background-500 text-xs font-normal">{profileFormData.position.length + " / 50"}</p>
                                            </div>
                                        }
                                        autoComplete="organization-title"
                                        classNames={{ label: "w-full font-medium !text-current transition-colors !duration-1000 ease-in-out", input: "transition-colors !duration-1000 ease-in-out group-data-[invalid=true]:!text-current font-medium !placeholder-background-500 placeholder:!font-normal",  mainWrapper: "group-data-[invalid=true]:animate-shake", inputWrapper: "transition-colors !duration-1000 ease-in-out caret-primary group-data-[invalid=true]:caret-danger bg-background-100 group-data-[hover=true]:border-background-200 group-data-[focus=true]:!border-primary group-data-[invalid=true]:!border-danger border-transparent text-current" }}
                                        className="w-full"
                                        color="primary"
                                        name="position"
                                        labelPlacement="outside"
                                        type="text"
                                        radius="sm"
                                        size="md"
                                        variant="bordered"
                                        maxLength={50}
                                        isReadOnly={!isUpdating}
                                        placeholder={profile.position}
                                        value={profileFormData.position}
                                        onValueChange={(value) => handleInputChange('position', value)}
                                        isInvalid={profileErrors.position.length > 0}
                                        endContent={profileErrors.position.length === 0 ? <CheckmarkFilled className='size-4 text-background-500 group-data-[focus=true]:text-primary' /> : <DismissFilled className='size-4 text-danger' /> }
                                        errorMessage={() => (
                                            <div className="flex text-danger">
                                                <ul>
                                                    {profileErrors.position.map((error, i) => (
                                                        <li key={i}>{error}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    />

                                    <div className="w-full flex justify-between">
                                        <div className="flex items-center gap-1">
                                            <p className="font-medium text-sm pl-0.5">Teléfono</p>
                                        </div>
                                        <p className="!text-background-500 text-xs font-normal pr-2.5">{profileFormData.phone.length + " / 10"}</p>
                                    </div>
                                    <InputOtp
                                        autoComplete="tel"
                                        variant="bordered"
                                        color="primary"
                                        classNames={{segment: "w-full min-w-0 rounded-lg bg-background-100 text-current border-background-100 transition-colors !duration-1000 ease-in-out", segmentWrapper: "w-full", base: "w-full data-[invalid=true]:animate-shake"}}
                                        className="-mt-6"
                                        name="phone"
                                        length={10} 
                                        isReadOnly={!isUpdating}
                                        placeholder={profile.phone}
                                        value={profileFormData.phone}
                                        onValueChange={(value) => handleInputChange('phone', value)}
                                        isInvalid={profileErrors.phone.length > 0}
                                        errorMessage={() => (
                                            <div className="flex text-danger font-medium">
                                                <ul>
                                                    {profileErrors.phone.map((error, i) => (
                                                        <li key={i}>{error}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    />
                                </Form>

                                <div className="w-full flex justify-end py-8 sm:gap-4 gap-2">
                                    {isUpdating && (
                                        <Button
                                            className="bg-transparent dark:bg-background-100 transition-background !duration-1000 ease-in-out"
                                            radius="sm"
                                            startContent={<DismissFilled className="size-5"/>}
                                            onPress={() => {setIsUpdating(false); setProfileFormData(profile)}}
                                        >
                                            Cancelar
                                        </Button>
                                    )}

                                    <SecondaryButton
                                        label="Cerrar sesión"
                                        startContent={<DoorArrowLeftFilled className="size-5"/>}
                                        onPress={() => setIsLogoutOpen(true)}
                                    />
                                </div>
                                </>)
                            ))}
                        </DrawerBody>
                        </>
                    )}
                </DrawerContent>
            </Drawer>

            <LogOutModal isOpen={isLogoutOpen} onOpenChange={setIsLogoutOpen}/>

            <Modal
                hideCloseButton
                size="md"
                radius="lg"
                className="my-0"
                isDismissable={false}
                isOpen={isCPOpen}
                onOpenChange={setIsCPOpen}
                classNames={{wrapper: "overflow-hidden"}}
                ref={targetRef} 
                backdrop="blur"
            >
                <ModalContent className="bg-background">
                    {(onClose) => (
                        <>
                        <ModalHeader {...moveProps} className="flex flex-col gap-2 pb-4 pt-4">
                            <div className="w-full flex justify-end">
                                <CloseButton onPress={() => {onClose(); setCPErrors({})}}/>     
                            </div>
                            <p className="text-lg font-bold text-center">Cambiar contraseña</p>
                        </ModalHeader>
                        <ModalBody className="py-0 gap-0">
                            <p className="text-sm font-normal pb-6 text-center">Ingrese su contraseña actual y la nueva contraseña para poder actualizar su contraseña</p>
                            <Form onSubmit={onSubmitCP} id="cp-form" className="gap-6 flex flex-col" validationErrors={cPErrors}>
                                <Input
                                    label={
                                        <div className="flex justify-between">
                                            <div className="flex items-center gap-1">
                                                <p>Contraseña actual</p>
                                                <TextAsterisk16Filled className="size-3 text-background-500 group-data-[focus=true]:text-primary group-data-[invalid=true]:!text-danger"/>
                                            </div>
                                        </div>
                                    }
                                    classNames={{ label: "w-full font-medium !text-current", input: "group-data-[invalid=true]:!text-current font-medium",  mainWrapper: "group-data-[invalid=true]:animate-shake", inputWrapper: "caret-primary group-data-[invalid=true]:caret-danger bg-background-100 group-data-[hover=true]:border-background-200 group-data-[focus=true]:!border-primary group-data-[invalid=true]:!border-danger border-background-100 text-current" }}
                                    className="w-full"
                                    color="primary"
                                    name="currentPassword"
                                    autoComplete="current-password"
                                    labelPlacement="outside"
                                    type={isVisible ? "text" : "password"}
                                    radius="sm"
                                    size="md"
                                    variant="bordered"
                                    placeholder="Ingrese su contraseña actual"
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

                                <Input
                                    label={
                                        <div className="flex justify-between">
                                            <div className="flex items-center gap-1">
                                                <p>Nueva contraseña</p>
                                                <TextAsterisk16Filled className="size-3 text-background-500 group-data-[focus=true]:text-primary group-data-[invalid=true]:!text-danger"/>
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
                        <ModalFooter className="flex justify-center pt-4 pb-8 sm:gap-4 gap-2">
                            <Button
                                className="bg-transparent dark:bg-background-100"
                                radius="sm"
                                startContent={<DismissFilled className="size-5"/>}
                                onPress={() => {onClose(); setCPErrors({})}}
                            >
                                Cancelar
                            </Button>
                            
                            <Button
                                className="tracking-wide font-medium data-[hover=true]:-translate-y-1"
                                form="cp-form"
                                radius="sm"
                                variant="shadow"
                                color="primary"
                                type="submit"
                                startContent={!isCPLoading && <EditFilled className="size-5"/>}
                                isLoading={isCPLoading}
                            >
                                Actualizar
                            </Button>
                        </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    )
}