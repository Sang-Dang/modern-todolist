import getNovu from '@/lib/novu/_novu'

const novu = getNovu()

export async function createSubscriber(id: string, email: string, firstName: string) {
    // id, email, and firstName are required
    if (!(id && email && firstName)) {
        throw new Error('Invalid input parameters.')
    }

    const result = await novu.subscribers.identify(id, {
        email,
        firstName
    })

    return result.status === 201
}

export async function deleteSubscriber(id: string) {
    // id is required
    if (!id) {
        throw new Error('Invalid input parameters.')
    }

    // id does not exist
    if ((await novu.subscribers.get(id)).status === 404) {
        throw new Error(`Subscriber does not exist`)
    }

    const result = await novu.subscribers.delete(id)
    return result.status === 200
}

export async function hasSubscriber(id: string) {
    return (await novu.subscribers.get(id)).status === 200
}
