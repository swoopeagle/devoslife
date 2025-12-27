export default async function handler(req, res) {
    // 1. Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { name, email } = req.body;

    // 2. Send data to Airtable
    try {
        const response = await fetch(`https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/${process.env.AIRTABLE_TABLE_NAME}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.AIRTABLE_API_TOKEN}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                records: [
                    {
                        fields: {
                            Name: name,   // Ensure these match your Airtable column names exactly
                            Email: email,
                        },
                    },
                ],
            }),
        });

        if (!response.ok) {
            const error = await response.json();
            return res.status(response.status).json({ message: error.error.message });
        }

        // 3. Success!
        res.status(200).json({ message: 'Success' });

    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
}
