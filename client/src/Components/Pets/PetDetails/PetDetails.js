import React, { useState, useEffect } from 'react';
import style from './PetDetails.module.css';
import axios from 'axios';
import Spinner from '../../UI/Spinner/Spinner';
import { updateObject } from '../../../utils/utility';
import EditPet from '../EditPet/EditPet';

const PetDetails = (props) => {
    const [editForm, setEditForm] = useState(false);
    // const [formIsValid, setFormIsValid] = useState(false);

    const [selectedPet, setSelectedPet] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        await axios
            .get(`/api/pets/${props.match.params.id}`)
            .then((response) => {
                console.log('response from DB', response.data);

                setSelectedPet(
                    updateObject({
                        _id: response.data.pet._id,
                        name: response.data.pet.name,
                        specie: response.data.pet.specie,
                        breed: response.data.pet.breed,
                        age: response.data.pet.age,
                        diagnosis: response.data.pet.diagnosis,
                        treatment: response.data.pet.treatment,
                        owner: {
                            name: response.data.owner.name,
                            lastName: response.data.owner.lastName,
                            email: response.data.owner.email,
                            address: response.data.owner.address,
                            phoneNumber: response.data.owner.phoneNumber,
                        },
                    })
                );
            })

            .catch((err) => {
                console.log(err.response);
            });
    };
    console.log('selectedPet', selectedPet);

    const handleChange = (event) => {
        const { name, value } = event.target;
        console.log('name, value', name, value);

        setSelectedPet({
            ...selectedPet,
            [name]: value,
            address: {
                [name]: value,
            },
        });
    };

    console.log('selectedPet', selectedPet);

    const toggleEditForm = () => {
        setEditForm(() => !editForm);
    };
    const handleSubmit = (event) => {
        event.preventDefault();
        console.log('update');
        axios
            .put(`/api/pets/${selectedPet._id}`, {
                name: selectedPet.name,
                specie: selectedPet.specie,
                breed: selectedPet.breed,
                age: selectedPet.age,
                diagnosis: selectedPet.diagnosis,
                treatment: selectedPet.treatment,
            })
            .then((response) => {
                props.history.goBack();

                fetchData();
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const deletePet = async () => {
        await axios
            .delete(`/api/pets/${selectedPet._id}`)
            .then(() => {
                console.log(
                    `${selectedPet.name} ${selectedPet.lastName} was successfully removed`
                );
                props.history.goBack();
            })
            .catch((err) => {
                console.log(err);
            });
    };

    if (!selectedPet) return <Spinner />;
    return (
        <>
            {editForm ? (
                <EditPet
                    toggleEditForm={toggleEditForm}
                    handleChange={handleChange}
                    handleSubmit={handleSubmit}
                    selectedPet={selectedPet}
                />
            ) : (
                <div className={style.Card}>
                    <h3>{selectedPet.name}</h3>
                    <div className={style.Infos}>
                        <div style={{ width: '100%' }}>
                            <p>
                                <b>Specie:</b> {selectedPet.specie}
                            </p>
                            <p>
                                <b>Breed:</b> {selectedPet.breed}
                            </p>
                            <p>
                                {' '}
                                <b>Age:</b> {selectedPet.age}
                            </p>
                            <hr />
                            <p>
                                {' '}
                                <b>Diagnosis:</b>{' '}
                            </p>
                            <div className={style.TextBox}>
                                <p>{selectedPet.diagnosis}</p>
                            </div>
                            <p>
                                {' '}
                                <b>Treatment:</b>{' '}
                            </p>
                            <div className={style.TextBox}>
                                <p>{selectedPet.treatment}</p>
                            </div>
                        </div>
                        <div
                            style={{
                                width: '100%',
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                paddingLeft: '10%',
                            }}
                        >
                            <p>
                                <b>Owner:</b>{' '}
                            </p>
                            <div>
                                <p>
                                    &nbsp; <b>Name: </b>{' '}
                                    {selectedPet.owner.name}
                                </p>
                                <p>
                                    &nbsp; <b>Last name: </b>{' '}
                                    {selectedPet.owner.lastName}
                                </p>
                                <hr />
                                <p>
                                    &nbsp;{' '}
                                    <b>
                                        <img
                                            src="../../../../images/email-logo.png"
                                            alt="phone-logo"
                                            style={{
                                                width: '1.2rem',
                                                marginRight: '5%',
                                            }}
                                        />{' '}
                                    </b>
                                    {selectedPet.owner.email}
                                </p>
                                <p>
                                    &nbsp;{' '}
                                    <b>
                                        <img
                                            src="../../../../images/phone-logo.png"
                                            alt="phone-logo"
                                            style={{
                                                width: '1.2rem',
                                                marginRight: '5%',
                                            }}
                                        />
                                    </b>
                                    {selectedPet.owner.phoneNumber}
                                </p>
                            </div>

                            <hr />
                            <div
                                style={{
                                    height: '50%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                }}
                            >
                                <p>
                                    &nbsp; <b>Street: </b>{' '}
                                    {selectedPet.owner.address.street}
                                </p>
                                <p>
                                    &nbsp; <b>City: </b>{' '}
                                    {selectedPet.owner.address.city}
                                </p>
                                <p>
                                    &nbsp; <b>Zip code: </b>{' '}
                                    {selectedPet.owner.address.zipCode}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className={style.buttons}>
                        <div>
                            <button onClick={() => props.history.goBack()}>
                                Back
                            </button>
                        </div>
                        <div
                            style={{
                                display: 'flex',
                                marginRight: '5%',
                                width: ' 200px',
                                justifyContent: 'space-around',
                            }}
                        >
                            <button onClick={toggleEditForm}>Edit</button>
                            <button onClick={deletePet}>Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default PetDetails;
