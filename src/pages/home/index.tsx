import { signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/router'

// const items: MenuProps["items"] = [
//   {
//     key: "1",
//     icon: <UserOutlined className="mr-2" />,
//     label: <span>Profile</span>,
//   },
//   {
//     key: "2",
//     icon: <LogoutOutlined />,
//     danger: true,
//     label: <span>Log out</span>,
//     onClick: () => void signOut(),
//   },
// ];

export default function Homepage() {
    const router = useRouter()

    const { data: session } = useSession({
        required: true,
        onUnauthenticated() {
            void router.push('/')
        }
    })

    if (!session) {
        return <div className="grid h-screen w-screen place-items-center">{/* <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} /> */}</div>
    }

    return (
        <div id="page_home" className="flex h-screen w-screen flex-col">
            <header className="flex h-16 w-full items-center bg-blue-700/90 px-12 py-4">
                <h1 className="mb-0 flex-grow cursor-pointer select-none text-2xl font-extrabold text-white">Todolist</h1>
                {/* <Dropdown menu={{ items }} trigger={["click"]}>
          <Avatar
            src={session.user.image}
            icon={<UserOutlined />}
            className="grid h-10 w-10 place-items-center hover:border-2 hover:border-slate-500"
          />
        </Dropdown> */}
            </header>
            <main className="relative flex h-full w-screen">
                <aside className="relative z-10 h-full w-64 bg-white p-3 shadow-md">{/* <MenuOutlined /> */}</aside>
                <div className="h-full w-full bg-slate-100">fsdfsd</div>
            </main>
        </div>
    )
}
