import { CloseButton } from "../components/CloseButton"
import { getNotifications } from "../service/notifications"
import { addToast, Spinner as SpinnerH, Button, Card, CardBody, Dropdown, DropdownItem, DropdownMenu, DropdownSection, DropdownTrigger, Pagination, Popover, PopoverContent, PopoverTrigger, Select, SelectItem, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Modal, ModalBody, ModalContent, ModalHeader, ModalFooter, useDraggable, Drawer, DrawerContent, DrawerHeader, DrawerBody, Input, Badge } from "@heroui/react"
import { PrimaryButton } from "../components/PrimaryButton"
import React, { useCallback, useEffect, useRef, useState, useTransition } from "react"
import { ArrowSortDownLinesFilled, ArrowSortFilled, ArrowSortUpLinesFilled, ChevronDownFilled, CircleFilled, DismissCircleFilled, PersonInfoFilled, MoreVerticalFilled, OptionsFilled, PersonAddFilled, PersonAvailableFilled, PersonEditFilled, PersonSubtractFilled, ChevronDoubleDownFilled, ChevronDoubleUpFilled, DismissFilled, AlertFilled, CloudDatabaseFilled } from "@fluentui/react-icons"
import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"
import { formatDateLiteral } from "../js/utils"

export const Notifications = ({isOpen, onOpenChange}) => {
    let navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(true)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedNoti, setSelectedNoti] = useState({})

    const targetRef = useRef(null)
    const {moveProps} = useDraggable({targetRef, isDisabled: !isModalOpen})

    const [refreshTrigger, setRefreshTrigger] = useState(false)
    const triggerRefresh = () => setRefreshTrigger(prev => !prev)

    const [isAscendant, setIsAscendant] = useState(false)
    const toggleSort = () => {
        setIsAscendant(prev => {
            const nextAsc = !prev

            setNotis(oldNotis => {
                const sorted = [...oldNotis].sort((a, b) =>
                    new Date(a.createdAt) - new Date(b.createdAt)
                )
                if (!nextAsc) sorted.reverse()
                    return sorted
            })

            setPage(1)

            return nextAsc
        })
    }

    const [notis, setNotis] = useState([])
    const [errors, setErrors] = useState([])

    const [, startTransition] = useTransition()

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true)

                const data = await getNotifications()
                const response = data.data 

                if (response) {
                    const sortedByDate = [...response].sort((a, b) => {
                        const diff = new Date(a.createdAt) - new Date(b.createdAt)
                        return -diff
                    })

                    const dataCount = sortedByDate.map((item, index) => ({
                        ...item,
                        n: index + 1
                    }))

                    startTransition(() => {
                        setNotis(dataCount)
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
    }, [refreshTrigger, isOpen])

    const [selectedKeys, setSelectedKeys] = React.useState(new Set([]))

    const [rowsPerPage, setRowsPerPage] = React.useState(10)

    const [sortDescriptor, setSortDescriptor] = React.useState({
        column: "n",
        direction: "ascending",
    })

    const [page, setPage] = React.useState(1)

    const [searchValue, setSearchValue] = useState("")

    useEffect(() => {
        setPage(1)
    }, [searchValue])

    const hasSearchFilter = Boolean(searchValue)
    
    const filteredItems = React.useMemo(() => {
        let filteredNotis = [...notis]
    
        if (hasSearchFilter) {
            filteredNotis = filteredNotis.filter((noti) =>
                noti.title.toLowerCase().includes(searchValue.toLowerCase()),
            )
        }
    
        return filteredNotis
    }, [notis, searchValue])

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
        return sortedItems.map((noti, idx) => ({
            ...noti,
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
    
    const topContent = useCallback((onClose) => {
        const sortOptions = [
            { key: "n", label: "Número" },
        ]

        const totalFiltered = filteredItems.length
        const startIndex = (page - 1) * rowsPerPage + 1
        const endIndex = Math.min(page * rowsPerPage, totalFiltered)

        return (
            <div className="flex flex-col gap-4 n2 pt-2">
                <div className="flex flex-col n7">
                    <div className="w-full flex justify-between pt-4 pb-2">
                        <p className="text-lg font-bold">Mis notificaciones</p>
                        <div className="flex sm:gap-6 gap-4 items-center justify-center">
                            <Badge color="primary" content={notis.length} shape="circle">
                                <AlertFilled className="size-5"/>
                            </Badge>
                            <CloseButton onPress={onClose}/>     
                        </div>
                    </div>

                    <span className="text-background-500 text-xs -mt-2">
                        {totalFiltered === 0
                        ? "Sin resultados"
                            : totalFiltered <= rowsPerPage
                            ? `Mostrando todos (${totalFiltered})`
                            : `Mostrando ${startIndex}–${endIndex} de ${totalFiltered}`}
                    </span>
                </div>

                <div className="flex gap-2 sm:gap-4">
                    <Input
                        classNames={{ input: "transition-colors !duration-1000 ease-in-out group-data-[invalid=true]:!text-current font-medium !placeholder-background-500 placeholder:!font-normal", mainWrapper: "group-data-[invalid=true]:animate-shake", inputWrapper: "transition-colors !duration-1000 ease-in-out caret-primary group-data-[invalid=true]:caret-danger bg-background-100 group-data-[hover=true]:border-background-200 group-data-[focus=true]:!border-primary group-data-[invalid=true]:!border-danger border-transparent text-current" }}
                        className="w-40 max-xs:w-[104px]"
                        color="primary"
                        name="search"
                        labelPlacement="inside"
                        type="text"
                        radius="sm"
                        size="md"
                        variant="bordered"
                        maxLength={100}
                        value={searchValue}
                        onValueChange={(val) => {
                            setSearchValue(val)
                        }}
                        placeholder="Buscar..."
                    />
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
                            </div>
                        </PopoverContent>
                    </Popover>

                    <Button
                        className="bg-transparent dark:bg-background-100 transition-background !duration-1000 ease-in-out"
                        radius="sm"
                        onPress={toggleSort}
                        startContent={isAscendant ? <ChevronDoubleUpFilled className="size-5"/> : <ChevronDoubleDownFilled className="size-5"/>}
                    >
                        {isAscendant ? "Ver más recientes" : "Ver más antigüos"}
                    </Button>
                </div>
            </div>
        )
    }, [
        filteredItems,
        searchValue,
        onSearchChange,
        rowsPerPage,
        onRowsPerPageChange,
        page,
        notis.length,
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
            <Drawer
                hideCloseButton
                size="md"
                radius="sm"
                isOpen={isOpen} 
                onOpenChange={onOpenChange}
                classNames={{wrapper: "!h-[100dvh]", backdrop: "bg-black/30"}}
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
                        <DrawerBody className="h-full flex flex-col justify-between [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-primary">
                            {isLoading ? (
                                <div className="relative w-full h-full flex flex-col pt-2 gap-2">
                                    <div className="w-full flex justify-between pt-4 pb-2">
                                        <p className="text-lg font-bold">Mis notificaciones</p>
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
                                        <p className="text-lg font-bold">Mis notificaciones</p>
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
                            ) : ( notis.length > 0 ? (
                                <Table
                                    isHeaderSticky
                                    radius="none"
                                    shadow="none"
                                    aria-label="Tabla de notis"
                                    topContentPlacement="outside"
                                    bottomContentPlacement="inside"
                                    hideHeader
                                    topContent={topContent(onClose)}
                                    bottomContent={bottomContent}
                                    classNames={classNames}
                                    selectedKeys={selectedKeys}
                                    onSelectionChange={setSelectedKeys}
                                    sortDescriptor={sortDescriptor}
                                    onSortChange={setSortDescriptor}>

                                    <TableHeader className="bg-transparent">
                                        <TableColumn key="card" hideHeader>
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
                                                        <Card shadow="none" radius="sm" isPressable onPress={() => {setSelectedNoti(item); setIsModalOpen(true)}} className="w-full transition-colors !duration-1000 ease-in-out bg-transparent dark:bg-background-100 shadow-small">
                                                            <CardBody className="pl-4 n5">
                                                                <div className={`absolute left-0 inset-y-4 w-1 bg-primary rounded-full`}></div>
                                                                <div className="w-full h-full flex justify-between">
                                                                    <div>
                                                                        <div className="pb-2">
                                                                            <div className="flex gap-1 pb-1 items-end">
                                                                                <p className="text-sm font-medium break-words line-clamp-2">{item.title}</p>
                                                                            </div>
                                                                            <div className={`flex gap-1 text-xs items-start text-primary`}>
                                                                                <p>{formatDateLiteral(item.createdAt, true)}</p>
                                                                                <p className="text-xs text-background-500 pb-[2px]">#{item.n}</p>
                                                                            </div>
                                                                        </div>
                                                                        <p className="text-xs text-background-500 max-w-full break-words line-clamp-2"><span className="text-background-700 font-medium">Descripción: </span>{item.description}</p>
                                                                        <p className="text-xs text-background-500 max-w-full break-all line-clamp-1"><span className="text-background-700 font-medium">Por: </span>{item.createdByName}</p>
                                                                    </div>
                                                                </div>
                                                            </CardBody>
                                                        </Card>
                                                    </motion.div>
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>) : (
                                <div className="relative w-full h-full flex flex-col pt-2 gap-2">
                                    <div className="w-full flex justify-between pt-4 pb-2">
                                        <p className="text-lg font-bold">Mis notificaciones</p>
                                        <CloseButton onPress={onClose}/>     
                                    </div>       

                                    <div className="flex-1 justify-center items-center flex">
                                        <div className="flex flex-col gap-3 w-full px-6 -mt-10">
                                            <CloudDatabaseFilled className="size-10"/>
                                    
                                            <p className="text-base sm:text-lg">Actualmente no cuenta con notificaciones</p>
                                            <p className="text-xs sm:text-sm">Aquí se mostraran sus notificaciones existentes</p>
                                        </div>
                                    </div>
                                </div>)
                            ))}
                        </DrawerBody>
                        </>
                    )}
                </DrawerContent>
            </Drawer>
            
            <Modal
                hideCloseButton
                size="md"
                radius="lg"
                className="my-0"
                isOpen={isModalOpen}
                onOpenChange={setIsModalOpen}
                classNames={{wrapper: "overflow-hidden"}}
                ref={targetRef} 
            >
                <ModalContent className="bg-background">
                    {(onClose) => (
                        <>
                        <ModalHeader {...moveProps} className="flex flex-col pb-2 pt-4">
                            <div className="w-full flex justify-end">
                                <CloseButton onPress={onClose}/>     
                            </div>
                        </ModalHeader>
                        <ModalBody className="py-0 gap-2">
                            <p className="font-semibold break-words">{selectedNoti.title}</p>
                            <p className="font-medium text-primary text-sm break-words">{formatDateLiteral(selectedNoti.createdAt, true)}</p>
                            <p className="text-sm break-words"><span className="font-medium">Por: </span>{selectedNoti.createdByName}</p>
                            <p className="text-sm break-words"><span className="font-medium">Correo electrónico del usuario: </span>{selectedNoti.createdByEmail}</p>
                            <p className="text-sm break-words"><span className="font-medium">Descripción: </span>{selectedNoti.description}</p>
                        </ModalBody>
                        <ModalFooter className="flex pt-4 pb-8 justify-center">
                        </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    )
}