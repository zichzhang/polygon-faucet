async function getDrip(address) {
    const response = await fetch("http://localhost:4000/request/eth/" + address, { method: 'GET' })
    console.log("Getting drip...");

    if (!response.ok) {
        const message = `An error has occured: ${response.status}`;
        throw new Error(message);
    }
    console.log("Success!")
    return "Success!";
}

export default getDrip;