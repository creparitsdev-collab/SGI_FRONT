import { DoorFilled, EmojiSadFilled } from "@fluentui/react-icons"
import { PrimaryButton } from "../components/PrimaryButton"
import { useNavigate } from "react-router"
import { HomeIcon } from "@heroicons/react/24/solid"
import { useAuth } from "../hooks/useAuth"

export const Page404 = () => {
    let navigate = useNavigate()
	const { user } = useAuth()

	const description = !user 
		? "Lo sentimos, la página que está buscando no existe. Por favor verifique que la dirección sea correcta."
		: "Lo sentimos, la página que está buscando no existe. Por favor verifique que la dirección sea correcta o regrese al inicio para continuar en la aplicación"

    return (
        <div className="flex h-screen w-full justify-center items-center">
			<div className="flex flex-col gap-5 max-w-[450px] px-6 sm:px-0">
                <div className="flex gap-5">
				    <EmojiSadFilled className="size-12"/>
                    <p className="text-4xl font-semibold">Error 404</p>
                </div>
		
				<p className="text-lg sm:text-xl">Página no encontrada</p>
				<p className="text-sm sm:text-base">{description}</p>
		
				<div className="flex justify-end pt-3">
					<PrimaryButton
						label={!user ? "Iniciar sesión" : "Ir al inicio"}
						startContent={!user ? <DoorFilled className="size-5"/> : <HomeIcon className="size-5"/>}
						onPress={() => !user ? navigate("/") : navigate("/App")}
					/>
				</div>
			</div>
		</div>
    )
}