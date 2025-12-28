import { addToast, Spinner as SpinnerH, Button, Card, CardBody, Dropdown, DropdownItem, DropdownMenu, DropdownSection, DropdownTrigger, Pagination, Popover, PopoverContent, PopoverTrigger, Select, SelectItem, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@heroui/react"
import { getUsers, getUsersButMe } from "../service/user"
import { PrimaryButton } from "../components/PrimaryButton"
import React, { useEffect, useState, useTransition } from "react"
import { useIsIconOnlyMedium } from "../hooks/useIsIconOnly"
import { ArrowSortDownLinesFilled, ArrowSortFilled, ArrowSortUpLinesFilled, ChevronDownFilled, CircleFilled, DismissCircleFilled, PersonInfoFilled, MoreVerticalFilled, OptionsFilled, PersonAddFilled, PersonAvailableFilled, PersonEditFilled, PersonSubtractFilled, PersonClockFilled, ScriptFilled } from "@fluentui/react-icons"
import { motion } from "framer-motion"
import { useNavigate, useOutletContext } from "react-router-dom"
import { UsersDrawer } from "../components/users/UsersDrawer"
import { UsersChangeStatusModal } from "../components/users/UsersChangeStatusModal"
import { formatDateLiteral } from "../js/utils"
import { useAuth } from "../hooks/useAuth"

export const Users = () => {
    let navigate = useNavigate()
    const {user} = useAuth()

    const [isLoading, setIsLoading] = useState(true)
    const [refreshTrigger, setRefreshTrigger] = useState(false)
    const triggerRefresh = () => setRefreshTrigger(prev => !prev)

    const [users, setUsers] = useState([])
    const [errors, setErrors] = useState([])

    const isIconOnlyMedium = useIsIconOnlyMedium()
    const [, startTransition] = useTransition()
    const {searchValue, setSearchValue, userName, id} = useOutletContext()
    const [isDrawerOpen, setIsDrawerOpen] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false)

    const [selectedUser, setSelectedUser] = useState({})
    const [action, setAction] = useState("")

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true)

                const response = await getUsersButMe()
                const data = response.data

                if (data) {
                    const dataCount = data.map((item, index) => ({
                        ...item,
                        n: index + 1,
                        role: item.roleId === 1 ? "ADMIN" : (item.roleId === 2 ? "SUPERVISOR" : "OPERADOR"),
                        status: item.status ? "activo" : "inactivo"
                    }))
                    
                    startTransition(() => {
                        setUsers(dataCount)

                        setSelectedUser(prev => {
                            if (!prev) return null
                            const updated = dataCount.find(u => u.id === prev.id)
                            return updated ?? prev
                        })

                        setIsLoading(false)
                    })
                } else {
                    addToast({
                        title: "No se pudieron obtener los datos",
                        description: "Ocurrió un error al obtener los datos",
                        color: "danger",
                        icon: <DismissCircleFilled className='size-5' />
                    })
                    startTransition(() => {
                        setErrors(prev => [...prev, "No se pudieron obtener los datos"])
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
        fetchData()
    }, [refreshTrigger])

    const statusOptions = [
        {name: "Activo", uid: "activo"},
        {name: "Inactivo", uid: "inactivo"},
    ]
    
    function capitalize(s) {
        return s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : ""
    }

    const [selectedKeys, setSelectedKeys] = React.useState(new Set([]))

    const [statusFilter, setStatusFilter] = React.useState(new Set(["activo", "inactivo"]))

    const [rowsPerPage, setRowsPerPage] = React.useState(10)

    const [sortDescriptor, setSortDescriptor] = React.useState({
        column: "n",
        direction: "ascending",
    })

    const [page, setPage] = React.useState(1)

    useEffect(() => {
        setPage(1)
    }, [searchValue, statusFilter])

    const hasSearchFilter = Boolean(searchValue)
    
    const filteredItems = React.useMemo(() => {
        let filteredUsers = [...users]
    
        if (hasSearchFilter) {
            filteredUsers = filteredUsers.filter((user) =>
                user.name.toLowerCase().includes(searchValue.toLowerCase()),
            )
        }
        if (statusFilter !== "all" && Array.from(statusFilter).length !== statusOptions.length) {
            filteredUsers = filteredUsers.filter((user) =>
                Array.from(statusFilter).includes(user.status),
            )
        }
    
        return filteredUsers
    }, [users, searchValue, statusFilter])

    const pages = Math.ceil(filteredItems.length / rowsPerPage)
    
    const items = React.useMemo(() => {
        const start = (page - 1) * rowsPerPage
        const end = start + rowsPerPage

        return filteredItems.slice(start, end)
    }, [page, filteredItems, rowsPerPage])
    
    const sortedItems = React.useMemo(() => {
        return [...items].sort((a, b) => {
            const first = a[sortDescriptor.column]
            const second = b[sortDescriptor.column]
            const cmp = first < second ? -1 : first > second ? 1 : 0
        
            return sortDescriptor.direction === "descending" ? -cmp : cmp
        })
    }, [sortDescriptor, items])

    const paginatedSortedItems = React.useMemo(() => {
        return sortedItems.map((user, idx) => ({
            ...user,
            pageIndex: idx,    // idx va de 0 a (rowsPerPage - 1)
        }))
    }, [sortedItems])

    const onRowsPerPageChange = React.useCallback((e) => {
        setRowsPerPage(Number(e.target.value))
        setPage(1)
    }, [])
    
    const onSearchChange = React.useCallback((value) => {
        setSearchValue(value)
        setPage(1)
    }, [setSearchValue])

    const handleSort = (key) => {
        setSortDescriptor((prev) => ({
            column: key,
            direction:
                prev.column === key
                ? prev.direction === "ascending"
                    ? "descending"
                    : "ascending"
                : "ascending",
            })
        )
    }

    const endContent = (key) => {
        return sortDescriptor.column === key
            ? sortDescriptor.direction === "ascending"
                ? <ArrowSortUpLinesFilled className="size-5"/>
                : <ArrowSortDownLinesFilled className="size-5"/>
            : null
    }

    const handleReadUser = (user) => {
        setAction("")
        setSelectedUser(user)
    }

    const handleCreateUser = () => {
        setAction("create")
        setSelectedUser(null)
    }

    const handleUpdateUser = (user) => {
        setAction("update")
        setSelectedUser(user)
    }

    const handleChangeStatusUser = (user) => {
        setSelectedUser(user)
        setIsModalOpen(true)
    }
    
    const topContent = React.useMemo(() => {
        const sortOptions = [
            { key: "n", label: "Número" },
            { key: "email", label: "Correo" },
            { key: "name", label: "Nombre" },
            { key: "role", label: "Rol" },
            { key: "position", label: "Puesto" },
        ]

        const totalFiltered = filteredItems.length
        const startIndex = (page - 1) * rowsPerPage + 1
        const endIndex = Math.min(page * rowsPerPage, totalFiltered)

        return (
            <div className="flex justify-between gap-4 items-center px-1 n2">
                <div className="flex flex-col n7">
                    <p className="text-lg font-bold">Usuarios</p>
                    <span className="text-background-500 text-xs">
                        {totalFiltered === 0
                        ? "Sin resultados"
                            : totalFiltered <= rowsPerPage
                            ? `Mostrando todos (${totalFiltered})`
                            : `Mostrando ${startIndex}–${endIndex} de ${totalFiltered}`}
                    </span>
                </div>

                <div className="flex gap-2 sm:gap-4">
                    <Popover placement="bottom" shadow="lg" radius="sm">
                        <PopoverTrigger>
                            <Button
                                className="n8 bg-transparent dark:bg-background-100 transition-background !duration-1000 ease-in-out"
                                isIconOnly
                                radius="sm"
                            >
                                <OptionsFilled className="size-5"/>
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="bg-background dark:bg-background-200 transition-colors duration-1000 ease-in-out w-32 shadow-large">
                            <div className="p-1 flex flex-col items-start w-full h-full">
                                <p className="text-xs text-background-500 pt-1 pb-1">Opciones</p>
                                
                                <Popover placement="left-start" shadow="lg" radius="sm" crossOffset={-32} offset={11}>
                                    <PopoverTrigger>
                                        <Button
                                            className="bg-transparent -ml-2 px-3"
                                            disableAnimation
                                            radius="sm"
                                            endContent={<ArrowSortFilled className="ml-3 size-4"/>}
                                        >
                                            Ordenar
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="bg-background dark:bg-background-200 transition-colors duration-1000 ease-in-out w-32 shadow-large">
                                        <div className="p-1 flex flex-col items-start w-full h-full">
                                            <p className="text-xs text-background-500 pt-1 pb-1">Ordenar por:</p>
                                            
                                            {sortOptions.map(opt => (
                                                <Button
                                                    disableRipple
                                                    radius="sm"
                                                    size="sm"
                                                    key={opt.key}
                                                    className="!bg-transparent text-sm -ml-2 py-5"
                                                    onPress={() => handleSort(opt.key)}
                                                    endContent={endContent(opt.key)}
                                                >
                                                {opt.label}
                                                </Button>
                                            ))}
                                        </div>
                                    </PopoverContent>
                                </Popover>

                                <Select
                                    disallowEmptySelection
                                    className="w-28 flex-none"
                                    aria-label="Select filas"
                                    renderValue={(items) => {
                                        const selectedKey = items.values().next().value?.key
                                        return <p>Filas: {selectedKey}</p>}
                                    }
                                    size="md"
                                    radius="sm"
                                    selectionMode="single"
                                    defaultSelectedKeys={[`${rowsPerPage}`]}
                                    onChange={onRowsPerPageChange}
                                    selectorIcon={<ChevronDownFilled className="size-5"/>}
                                    classNames={{
                                        trigger: "border-0 shadow-none !bg-transparent -ml-2",
                                        popoverContent: "text-current bg-background dark:bg-background-200 shadow-large transition-colors duration-1000 ease-in-out rounded-lg",
                                    }}
                                    listboxProps={{
                                        itemClasses: {
                                            base: "!bg-transparent hover:!text-background-950/60 transition-colors duration-1000 ease-in-out",
                                        }
                                    }}
                                >
                                    <SelectItem key="5" value="5">5</SelectItem >
                                    <SelectItem key="10" value="10">10</SelectItem>
                                    <SelectItem key="15" value="15">15</SelectItem >
                                    <SelectItem key="20" value="20">20</SelectItem >
                                </Select>

                                <Select
                                    disallowEmptySelection
                                    className="w-28 flex-none"
                                    aria-label="Select status"
                                    renderValue={() => <p>Status</p>}
                                    size="md"
                                    radius="sm"
                                    selectionMode="multiple"
                                    selectedKeys={statusFilter}
                                    onSelectionChange={setStatusFilter} 
                                    selectorIcon={<ChevronDownFilled className="size-5"/>}
                                    classNames={{
                                        trigger: "border-0 shadow-none !bg-transparent -ml-2",
                                        popoverContent: "text-current bg-background dark:bg-background-200 shadow-large transition-colors duration-1000 ease-in-out rounded-lg",
                                    }}
                                    listboxProps={{
                                        itemClasses: {
                                            base: "!bg-transparent hover:!text-background-950/60 transition-colors duration-1000 ease-in-out",
                                        }
                                    }}>
                                    {statusOptions.map((status) => (
                                        <SelectItem key={status.uid}>
                                            {capitalize(status.name)}
                                        </SelectItem>
                                    ))}
                                </Select>
                            </div>
                        </PopoverContent>
                    </Popover>

                    {user.role === "ADMIN" &&
                    <PrimaryButton
                        tooltipPlacement="bottom"
                        label="Registrar"
                        startContent={<PersonAddFilled className="size-5 "/>}
                        onPress={() => {handleCreateUser(); setIsDrawerOpen(true)}}
                    />}
                </div>
            </div>
        )
    }, [
        filteredItems,
        searchValue,
        statusFilter,
        onSearchChange,
        rowsPerPage,
        onRowsPerPageChange,
        page,
        users.length,
        hasSearchFilter,
        sortDescriptor
    ])
    
    const bottomContent = React.useMemo(() => {
        if (filteredItems.length > 0){
            return (
                <div className="flex justify-end">
                    <Pagination
                        showControls
                        showShadow
                        className="-m-0 px-0 pt-2 pb-2.5 n4"
                        aria-label="Pagination tabla"
                        radius="sm"
                        variant="light"
                        color="primary"
                        page={page}
                        total={pages || 1}
                        onChange={setPage}
                        classNames={{ cursor: "font-medium", wrapper: "gap-0 sm:gap-1" }}
                    />
                </div>
            )
        }
    }, [filteredItems.length, page, pages])

    const classNames = React.useMemo(
        () => ({
            thead: "[&>tr]:first:shadow-none [&>tr:last-child]:hidden",
            th: "bg-transparent",
            td: [
                "px-1 py-2",
                // changing the rows border radius
                // first
                "group-data-[first=true]/tr:first:before:rounded-none",
                "group-data-[first=true]/tr:last:before:rounded-none",
                // middle
                "group-data-[middle=true]/tr:before:rounded-none",
                // last
                "group-data-[last=true]/tr:first:before:rounded-none",
                "group-data-[last=true]/tr:last:before:rounded-none",
            ],
            wrapper: "rounded-[9px] n3 gap-0 overflow-y-auto overflow-x-auto md:pt-0 md:pb-0 md:pl-2 md:pr-2 p-1 transition-colors duration-1000 bg-transparent [&::-webkit-scrollbar-corner]:bg-transparent [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar]:h-1 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-primary", // Ajuste principal
            base: "h-full",
            table: "bg-transparent",
            emptyWrapper: "text-background-950 text-sm"
        }), [],
    )
    
    return (
        <>
            {isLoading ? (
                <div className="relative w-full h-full px-1">
                    <p className="text-lg font-bold">Usuarios</p>
            
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
                <div className="w-full h-full px-1">
                    <p className="text-lg font-bold">Usuarios</p>

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
            ) : ( users.length > 0 && (
                <Table
                    isHeaderSticky
                    radius="none"
                    shadow="none"
                    aria-label="Tabla de usuarios"
                    topContentPlacement="outside"
                    bottomContentPlacement="inside"
                    hideHeader={isIconOnlyMedium}
                    topContent={topContent}
                    bottomContent={bottomContent}
                    classNames={classNames}
                    selectedKeys={selectedKeys}
                    onSelectionChange={setSelectedKeys}
                    sortDescriptor={sortDescriptor}
                    onSortChange={setSortDescriptor}>

                    <TableHeader className="bg-transparent">
                        <TableColumn key="card" hideHeader={isIconOnlyMedium} className="bg-background transition-colors !duration-1000 ease-in-out">
                            <Card shadow="none" className="w-full bg-transparent p-0" radius="sm">
                                <CardBody className="p-0">
                                    <div className="flex w-full items-center justify-between gap-2 text-sm font-medium">
                                        <div className="w-7 flex-shrink-0 ml-4">
                                            #
                                        </div>
                                        
                                        <div className="flex-1 min-w-0 max-w-[25%]">
                                            Nombre
                                        </div>
                                        
                                        <div className="flex-1 min-w-0 max-w-[30%] truncate">
                                            Correo electrónico
                                        </div>
                                        
                                        <div className="w-20 flex-shrink-0">
                                            Rol
                                        </div>
                                        
                                        <div className="w-36 flex-shrink-0">
                                            Puesto
                                        </div>
                                        
                                        <div className="w-40 flex-shrink-0 text-center">
                                            Fecha de modificación
                                        </div>
                                        
                                        <div className="w-28 flex-shrink-0">
                                            Teléfono
                                        </div>
                                        
                                        <div className="w-[68px] flex-shrink-0 mr-4">
                                            Status
                                        </div>
                                        
                                        <div className="flex-shrink-0 flex text-center w-16">
                                            Acciones
                                        </div>
                                    </div>
                                </CardBody>
                            </Card>
                        </TableColumn>
                    </TableHeader>

                    <TableBody
                        className="bg-transparent" 
                        items={paginatedSortedItems}
                        emptyContent={filteredItems.length > 0 ? 
                            <SpinnerH 
                                classNames={{ label: "pt-2 text-sm" }} 
                                color="current" 
                                size="md" 
                                label="Espere un poco por favor" 
                            /> : 
                            "No se encontraron coincidencias"
                        }>
                        {(item) => (
                            <TableRow aria-label={item.n} key={item.n} className="hover:-translate-y-1 transition-all duration-250 ease-in-out">
                                <TableCell className="px-0 py-1">
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3, delay: item.pageIndex * 0.1 }}
                                    >
                                        <Card shadow="none" radius="sm" isPressable onPress={() => {handleReadUser(item); setIsDrawerOpen(true)}} className="w-full transition-colors !duration-1000 ease-in-out bg-transparent dark:bg-background-100 shadow-small">
                                            <CardBody className="md:px-2 md:py-1 pl-4 md:pl-0 n5">
                                                <div className={`absolute left-0 inset-y-4 w-1 ${item.status === "activo" ? "bg-primary" : "bg-background-500"} rounded-full md:inset-y-1`}></div>
                                                <div className="md:hidden w-full h-full flex justify-between">
                                                    <div>
                                                        <div className="xs:flex xs:items-center xs:gap-2 pb-2">
                                                            <div className="flex gap-1 pb-1 items-end">
                                                                <p className="text-sm font-medium break-all line-clamp-1">{item.name}</p>
                                                            </div>
                                                            <div className={`flex gap-1 text-xs items-start ${item.status === "activo" ? "text-primary" : "text-background-500"}`}>
                                                                <p className="text-background-950">{capitalize(item.role)}</p>
                                                                <p>{item.status}</p>
                                                                <p className="text-xs text-background-500 pb-[2px]">#{item.n}</p>
                                                            </div>
                                                        </div>
                                                        <p className="text-xs text-background-500 max-w-full break-all line-clamp-1"><span className="text-background-700 font-medium">Correo electrónico: </span>{item.email}</p>
                                                        <p className="text-xs text-background-500 max-w-full break-all line-clamp-1"><span className="text-background-700 font-medium">Puesto: </span>{item.position}</p>
                                                        <p className="text-xs text-background-500 max-w-full break-all line-clamp-1"><span className="text-background-700 font-medium">Fecha de modificación: </span>{formatDateLiteral(item.updatedAt, true)}</p>
                                                        {item.phone && (<p className="text-xs text-background-500 max-w-full break-all line-clamp-1"><span className="text-background-700 font-medium">Teléfono: </span>{item.phone}</p>)}
                                                    </div>
                                                    <div className="flex items-center pl-2">
                                                        <Dropdown placement="bottom-end" className="bg-background dark:bg-background-200 shadow-large transition-colors duration-1000 ease-in-out" offset={28} shadow="lg" radius="sm" classNames={{content: "min-w-44"}}>
                                                            <DropdownTrigger>
                                                                <Button className="bg-transparent" size="sm" radius="sm" isIconOnly as="a">
                                                                    <MoreVerticalFilled className="size-5"/>
                                                                </Button>
                                                            </DropdownTrigger>
                                                            <DropdownMenu aria-label="Acciones" variant="light" itemClasses={{base:"mt-1 mb-2"}}>
                                                                <DropdownSection title="Acciones" classNames={{ heading: "text-background-500 font-normal"}}>
                                                                    {user.role === "ADMIN" &&
                                                                    <DropdownItem 
                                                                        className="rounded-md transition-all !duration-1000 ease-in-out w-40"
                                                                        key="handleUpdateUser"
                                                                        startContent={<PersonEditFilled className="size-5"/>}
                                                                        onPress={() => {handleUpdateUser(item); setIsDrawerOpen(true)}}
                                                                    >
                                                                        Actualizar usuario
                                                                    </DropdownItem>}

                                                                    <DropdownItem 
                                                                        className="rounded-md transition-all !duration-1000 ease-in-out w-40 -mt-1"
                                                                        key="handleReadUser"
                                                                        startContent={<PersonInfoFilled className="size-5"/>}
                                                                        onPress={() => {handleReadUser(item); setIsDrawerOpen(true)}}
                                                                    >
                                                                        Ver más detalles
                                                                    </DropdownItem>

                                                                    {user.role === "ADMIN" &&
                                                                    <DropdownItem 
                                                                        className="rounded-md transition-all !duration-1000 ease-in-out w-40 -mt-1"
                                                                        key="handleChangeStatusUser"
                                                                        startContent={item.status === "activo" ? <PersonSubtractFilled className="size-5"/> : <PersonAvailableFilled className="size-5"/>}
                                                                        onPress={() => handleChangeStatusUser(item)}
                                                                    >
                                                                        {item.status === "activo" ? "Inhabilitar" : "Habilitar"}
                                                                    </DropdownItem>}
                                                                    
                                                                    {user.role === "ADMIN" &&
                                                                    <DropdownItem 
                                                                        className="rounded-md transition-all !duration-1000 ease-in-out w-40 -mb-1"
                                                                        key="logs"
                                                                        startContent={<ScriptFilled className="size-5"/>}
                                                                        onPress={() => {navigate("/App/Logs"); setSearchValue(item.name)}}
                                                                    >
                                                                        Ver sus logs
                                                                    </DropdownItem>}
                                                                </DropdownSection>
                                                            </DropdownMenu>
                                                        </Dropdown>
                                                    </div>
                                                </div>

                                                <div className="hidden md:flex w-full h-full items-center justify-between gap-2">
                                                    <div className="w-7 flex-shrink-0 ml-4">
                                                        <p className={`text-sm truncate ${item.status === "activo" ? "text-primary" : "text-background-500"}`}>
                                                            {item.n}
                                                        </p>
                                                    </div>
                                                    
                                                    <div className="flex-1 min-w-0 max-w-[25%]">
                                                        <p className="text-sm truncate">
                                                            {item.name}
                                                        </p>
                                                    </div>
                                                    
                                                    <div className="flex-1 min-w-0 max-w-[30%]">
                                                        <p className="text-sm truncate">
                                                            {item.email}
                                                        </p>
                                                    </div>

                                                    <div className="w-20 flex-shrink-0">
                                                        <p className="text-sm truncate">
                                                            {capitalize(item.role)}
                                                        </p>
                                                    </div>
                                                    
                                                    <div className="w-36 flex-shrink-0">
                                                        <p className="text-sm truncate">
                                                            {item.position}
                                                        </p>
                                                    </div>

                                                    <div className="w-40 flex-shrink-0">
                                                        <p className="text-sm truncate text-center">
                                                            {formatDateLiteral(item.updatedAt)}
                                                        </p>
                                                    </div>

                                                    <div className="w-28 flex-shrink-0">
                                                        <p className="text-sm truncate">
                                                            {item.phone}
                                                        </p>
                                                    </div>
                                                    
                                                    <div className="w-[68px] flex-shrink-0 mr-4 flex items-center gap-1">
                                                        <CircleFilled className={`size-2 ${item.status === "activo" ? "text-primary" : "text-background-500"}`} />
                                                        <p className={`text-sm ${item.status === "activo" ? "text-primary" : "text-background-500"}`}>{capitalize(item.status)}</p>
                                                    </div>
                                                    
                                                    <div className="flex justify-center flex-shrink-0 w-16">
                                                        <Dropdown placement="bottom-end" className="bg-background dark:bg-background-200 shadow-large transition-colors duration-1000 ease-in-out" shadow="lg" radius="sm" classNames={{content: "min-w-44"}}>
                                                            <DropdownTrigger>
                                                                <Button className="bg-transparent" size="sm" radius="sm" isIconOnly as="a">
                                                                    <MoreVerticalFilled className="size-5"/>
                                                                </Button>
                                                            </DropdownTrigger>
                                                            <DropdownMenu aria-label="Acciones" variant="light" itemClasses={{base:"mt-1 mb-2"}}>
                                                                <DropdownSection title="Acciones" classNames={{ heading: "text-background-500 font-normal"}}>
                                                                    {user.role === "ADMIN" &&
                                                                    <DropdownItem 
                                                                        className="rounded-md transition-all !duration-1000 ease-in-out w-40"
                                                                        key="handleUpdateUser"
                                                                        startContent={<PersonEditFilled className="size-5"/>}
                                                                        onPress={() => {handleUpdateUser(item); setIsDrawerOpen(true)}}
                                                                    >
                                                                        Actualizar usuario
                                                                    </DropdownItem>}

                                                                    <DropdownItem 
                                                                        className="rounded-md transition-all !duration-1000 ease-in-out w-40 -mt-1"
                                                                        key="handleReadUser"
                                                                        startContent={<PersonInfoFilled className="size-5"/>}
                                                                        onPress={() => {handleReadUser(item); setIsDrawerOpen(true)}}
                                                                    >
                                                                        Ver más detalles
                                                                    </DropdownItem>

                                                                    {user.role === "ADMIN" && <>
                                                                    <DropdownItem 
                                                                        className="rounded-md transition-all !duration-1000 ease-in-out w-40 -mt-1"
                                                                        key="handleChangeStatusUser"
                                                                        startContent={item.status === "activo" ? <PersonSubtractFilled className="size-5"/> : <PersonAvailableFilled className="size-5"/>}
                                                                        onPress={() => handleChangeStatusUser(item)}
                                                                    >
                                                                        {item.status === "activo" ? "Inhabilitar" : "Habilitar"}
                                                                    </DropdownItem>
                                                                    
                                                                    <DropdownItem 
                                                                        className="rounded-md transition-all !duration-1000 ease-in-out w-40 -mb-1"
                                                                        key="logs"
                                                                        startContent={<ScriptFilled className="size-5"/>}
                                                                        onPress={() => {navigate("/App/Logs"); setSearchValue(item.name)}}
                                                                    >
                                                                        Ver sus logs
                                                                    </DropdownItem> </>}
                                                                </DropdownSection>
                                                            </DropdownMenu>
                                                        </Dropdown>
                                                    </div>
                                                </div>
                                            </CardBody>
                                        </Card>
                                    </motion.div>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>)
            ))}
            
            <UsersChangeStatusModal isOpen={isModalOpen} onOpenChange={setIsModalOpen} data={selectedUser} onRefresh={triggerRefresh}/>
            <UsersDrawer isOpen={isDrawerOpen} onOpenChange={setIsDrawerOpen} data={selectedUser} action={action} onRefresh={triggerRefresh}/>
        </>
    )
}