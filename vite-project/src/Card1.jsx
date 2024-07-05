import React, { useState } from 'react';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const Card1 = () => {
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [formData, setFormData] = useState({});

    const handleCardClick = () => {
        setIsFormVisible(true);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const { name, email } = formData;
        const userSchema = {
            name: { type: 'string' },
            email: { type: 'string', unique: true },
        };
        prisma.$create('users', userSchema, { data: { name, email } })
            .then((user) => console.log(user))
            .catch((error) => console.error(error));
    };

    return (
        <div className="card" onClick={handleCardClick}>
            {!isFormVisible && <h2>Sign Up!</h2>}
            {isFormVisible && (
                <form>
                    <label>
                        Name:
                        <input
                            type="text"
                            name="name"
                            onChange={(event) =>
                                setFormData({ ...formData, name: event.target.value })
                            }
                        />
                    </label>
                    <br />
                    <label>
                        Email:
                        <input
                            type="email"
                            name="email"
                            onChange={(event) =>
                                setFormData({ ...formData, email: event.target.value })
                            }
                        />
                    </label>
                    <br />
                    <input type="submit" value="Submit" />
                </form>
            )}
        </div>
    );
};

export default Card1;
