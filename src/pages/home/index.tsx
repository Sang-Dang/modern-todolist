import { LoadingOutlined, LogoutOutlined, UserOutlined } from '@ant-design/icons'
import { Avatar, Dropdown, Spin, type MenuProps } from 'antd'
import { signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import React from 'react'

const items: MenuProps['items'] = [
    {
        key: '1',
        icon: <UserOutlined className="mr-2" />,
        label: <span>Profile</span>
    },
    {
        key: '2',
        icon: <LogoutOutlined />,
        danger: true,
        label: <span>Log out</span>,
        onClick: () => void signOut()
    }
]

export default function Homepage() {
    const router = useRouter()

    const { data: session } = useSession({
        required: true,
        onUnauthenticated() {
            void router.push('/')
        }
    })

    if (!session) {
        return (
            <div className="grid h-screen w-screen place-items-center">
                <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
            </div>
        )
    }

    return (
        <div id="page_home" className="">
            <header className="flex h-16 items-center bg-blue-500 px-12 py-4">
                <h1 className="flex-grow text-2xl font-extrabold text-white">Todolist</h1>
                {/* <Button ghost color="black">
                    <BellOutlined />
                </Button> */}
                <Dropdown menu={{ items }} trigger={['click']}>
                    <Avatar
                        src={session.user.image}
                        icon={<UserOutlined />}
                        className="grid h-10 w-10 place-items-center"
                    />
                </Dropdown>
            </header>
            <aside></aside>
            <main></main>
        </div>
    )
}
