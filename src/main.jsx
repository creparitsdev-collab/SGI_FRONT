import './index.css'
import { StrictMode, useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { Button, HeroUIProvider, ToastProvider } from '@heroui/react'
import { BrowserRouter, Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth.jsx';
import { useAuth } from './hooks/useAuth.jsx';

import { LandingPage } from './pages/LandingPage.jsx';
import { Login } from './pages/Login.jsx';

import { AppLayout } from './layouts/AppLayout.jsx';
import { Home } from './pages/Home.jsx';
import { Users } from './pages/Users.jsx';
import { ArrowHookUpLeftFilled, ArrowHookUpRightFilled, ArrowLeftFilled, DismissFilled } from '@fluentui/react-icons';
import { MaintenanceCalibration } from './pages/MaintenanceCalibration.jsx';
import { Logs } from './pages/Logs.jsx';
import { Equipments } from './pages/Equipments.jsx';
import { Customers } from './pages/Customers.jsx';
import { Page404 } from './pages/Page404.jsx';
import { TourProvider, useTour } from '@reactour/tour';
import { MaintenanceProviders } from './pages/MaintenanceProviders.jsx';
import { ForgotPassword } from './pages/ForgotPassword.jsx';
import { ProductStatuses } from './pages/ProductStatuses.jsx';
import { StockCatalogues } from './pages/StockCatalogues.jsx';
import { UnitsOfMeasurement } from './pages/UnitsOfMeasurement.jsx';
import { WarehouseTypes } from './pages/WarehouseTypes.jsx';
import { Products } from './pages/Products.jsx';
import { Dashboard } from './pages/Dashboard.jsx';

function ProtectedRoute({ allowedRoles = [], children }) {
	const { user } = useAuth()
	
	if (!user) {
		return <Navigate to="/" replace/>
	}
	
	if (allowedRoles.length === 0) {
		return children
	}

	if (!allowedRoles.includes(user.role)) {
		return <Navigate to="/App" replace />
	}

	return children
}

const getStepsFor = (pathname) => {
	let steps = []
	switch (pathname) {
		case '/App':
			steps = [
				{
					selector: '.n1',
					content: 'Aquí puedes moverte a otros módulos o secciones de la aplicación sin perder el contexto.',
				},
				{
					selector: '.n2',
					content: 'Puedes buscar lo que necesites en esta barra de búsqueda.',
				},
				{
					selector: '.n3',
					content: 'Aquí puedes cambiar el tema de la aplicación, ver tu perfil, notificaciones y cerrar sesión.',
				},
				{
					selector: '.n4',
					content: 'Este es tu Dashboard principal. Aquí puedes ver estadísticas generales, productos por estado, alertas de stock bajo y productos recientes.',
				},
				{
					selector: '.n5',
					content: 'Haz clic en cualquier tarjeta para navegar a la sección correspondiente y ver más detalles.',
				},
				{
					selector: '.n6',
					content: 'Aquí puedes escribir palabras clave para buscar y filtrar instantáneamente los registros de la tabla.',
				},
				{
					selector: '.n9',
					content: 'Utiliza este botón para crear un nuevo registro; se abrirá un formulario con los datos necesarios.',
				},
			]
			break
		default:
			steps = [
				{
					selector: '.n1',
					content: 'Aquí puedes moverte a otros módulos o secciones de la aplicación sin perder el contexto.',
				},
				{
					selector: '.n2',
					content: 'Este es el título de la sección: te indica en qué módulo o tabla te encuentras actualmente.',
				},
				{
					selector: '.n3',
					content: 'En esta parte se listan todos los registros existentes; desplázate o haz scroll lateral para ver cada columna.',
				},
				{
					selector: '.n4',
					content: 'Desde aquí cambias entre páginas de resultados y ves cuántos registros hay en total.',
				},
				{
					selector: '.n5',
					content: 'Cada fila representa un registro individual; haz clic sobre ella (o en el icono de acciones) para ver más detalles o editar.',
				},
				{
					selector: '.n6',
					content: 'Aquí puedes escribir palabras clave para buscar y filtrar instantáneamente los registros de la tabla.',
				},
				{
					selector: '.n7',
					content: 'Este texto muestra el número de registros que coinciden con tu búsqueda o filtros aplicados.',
				},
				{
					selector: '.n8',
					content: 'Pulsa este botón para desplegar filtros avanzados y acotar los resultados según distintos criterios.',
				},
			]

			if (pathname !== '/App/Logs') {
				steps.push({
					selector: '.n9',
					content: 'Utiliza este botón para crear un nuevo registro; se abrirá un formulario con los datos necesarios.',
				})
			}
	}

	return steps
}

function TourRouteSync() {
	const { pathname } = useLocation()
	const { setSteps, setCurrentStep, setIsOpen } = useTour()

	useEffect(() => {
		const newSteps = getStepsFor(pathname)   // tu función ya existente
		setSteps(newSteps)                       // **actualiza** el array de pasos
		setCurrentStep(0)                        // vuelve al paso 0
		// si quieres que al cambiar ruta el tour se abra automáticamente:
		// setIsOpen(true)
	}, [pathname, setSteps, setCurrentStep, setIsOpen])

	return null
}

function TourWrapper({ children, ...tourProps }) {
	return (
		<TourProvider steps={[]} {...tourProps}>
			{/* aquí inyectamos el componente que controla los pasos */}
			<TourRouteSync />
			{children}
		</TourProvider>
	)
}

createRoot(document.getElementById('root')).render(
	<StrictMode>
		<BrowserRouter>
			<AuthProvider>
				<HeroUIProvider locale="es-MX">
					<TourWrapper 
						className='!bg-background !text-background-950 !rounded-lg !duration-500 ease-in-out transition-all'
						styles={{
							popover: base => ({
								...base,
								"--reactour-accent": "hsl(var(--heroui-primary) / var(--heroui-primary-opacity, var(--tw-bg-opacity)))",
								paddingTop: 16,
								paddingLeft: 16,
								width: 400,
							}),
								maskArea: base => ({
								...base,
								rx: 8,
							}),
								badge: base => ({
								...base,
								borderRadius: 8,
								height: 40,
								width: 40,
								display: "flex",
								justifyContent: "center",
								alignItems: "center",
								fontSize: 16,
								color: "hsl(var(--heroui-background) / var(--heroui-background-opacity, var(--tw-bg-opacity)))",
								left: "auto",
								right: -16
							}),
								controls: base => ({
								...base,
								marginBottom: -8,
								width: "100%",
								display: "flex",
								justifyContent: "space-between",
								boxSizing: "border-box",
							}), 
						}}
						prevButton={({ currentStep, setCurrentStep, steps }) => {
							const first = currentStep === 0
							return (
								<Button
									className="bg-transparent dark:bg-background-100 transition-background !duration-1000 ease-in-out"
									isIconOnly
									radius="sm"
									onPress={() => {
										if (first) {
											setCurrentStep((s) => steps.length - 1)
										} else {
											setCurrentStep((s) => s - 1)
										}
									}}
								>
									<ArrowHookUpLeftFilled className="size-5"/>
								</Button>
							)
						}}
						nextButton={({ currentStep, stepsLength, setCurrentStep, setIsOpen }) => {
							const isLast = currentStep === stepsLength - 1
							return (
								<Button
									className="bg-transparent dark:bg-background-100 transition-background !duration-1000 ease-in-out"
									isIconOnly
									radius="sm"
									onPress={() => isLast ? setIsOpen(false) : setCurrentStep(s => s + 1)}
								>
									{isLast ? <DismissFilled className="size-5"/> : <ArrowHookUpRightFilled className="size-5"/>}
								</Button>
							)
						}}
						showCloseButton={false}
					>
						<ToastProvider
							placement="bottom-left"
							toastOffset={60}
							maxVisibleToasts={2}
							toastProps={{
								variant: "flat",
								radius: "sm",
								closeIcon: <DismissFilled className='size-5'/>,
								shouldShowTimeoutProgress: true,
								classNames: {
									title: "pr-6",
									description: "pr-6",
									closeButton: "opacity-100 absolute right-4 top-1/2 -translate-y-1/2 ml-4",
									progressIndicator: "h-1 rounded-full opacity-100",
									base: "transition-colors !duration-1000 ease-in-out bg-background",
								},
							}}
						/>
						<Routes>
							<Route path='/' element={ <Outlet/> } >
								<Route index element={ <Login/> } />
								<Route path='ForgotPassword'>
									<Route index element={<ForgotPassword/>} />
									<Route path=':token' element={<ForgotPassword/>} />
								</Route>

								<Route
									path='App'
									element={
										<ProtectedRoute allowedRoles={[]}>
											<AppLayout />
										</ProtectedRoute>
									}
								>
									<Route
										index
										element={
											<ProtectedRoute allowedRoles={[]}>
												<Dashboard />
											</ProtectedRoute>
										}
									/>
									<Route
										path='Equipments'
										element={
											<ProtectedRoute allowedRoles={[]}>
												<Equipments />
											</ProtectedRoute>
										}
									/>
									<Route
										path='Products'
										element={
											<ProtectedRoute allowedRoles={[]}>
												<Products />
											</ProtectedRoute>
										}
									/>
									<Route
										path='StockCatalogues'
										element={
											<ProtectedRoute allowedRoles={['ADMIN', 'SUPERVISOR']}>
												<StockCatalogues />
											</ProtectedRoute>
										}
									/>
									<Route
										path='UnitsOfMeasurement'
										element={
											<ProtectedRoute allowedRoles={['ADMIN', 'SUPERVISOR']}>
												<UnitsOfMeasurement />
											</ProtectedRoute>
										}
									/>
									<Route
										path='WarehouseTypes'
										element={
											<ProtectedRoute allowedRoles={['ADMIN', 'SUPERVISOR']}>
												<WarehouseTypes />
											</ProtectedRoute>
										}
									/>
									<Route
										path='ProductStatuses'
										element={
											<ProtectedRoute allowedRoles={['ADMIN', 'SUPERVISOR']}>
												<ProductStatuses />
											</ProtectedRoute>
										}
									/>
									<Route
										path='Users'
										element={
											<ProtectedRoute allowedRoles={['ADMIN', 'SUPERVISOR']}>
												<Users />
											</ProtectedRoute>
										}
									/>
									<Route
										path='Logs'
										element={
											<ProtectedRoute allowedRoles={['ADMIN']}>
												<Logs />
											</ProtectedRoute>
										}
									/>
									<Route
										path='Customers'
										element={
											<ProtectedRoute allowedRoles={['ADMIN']}>
												<Customers />
											</ProtectedRoute>
										}
									/>
									<Route
										path='Services'
										element={
											<ProtectedRoute allowedRoles={[]}>
												<MaintenanceCalibration />
											</ProtectedRoute>
										}
									/>
									<Route
										path='ServiceProviders'
										element={
											<ProtectedRoute allowedRoles={['ADMIN', 'SUPERVISOR']}>
												<MaintenanceProviders />
											</ProtectedRoute>
										}
									/>
								</Route>
							</Route>
							<Route path="*" element={<Page404/>} />
						</Routes>
					</TourWrapper>
				</HeroUIProvider>
			</AuthProvider>
		</BrowserRouter>
	</StrictMode>
)
