import Header from '../../components/Header';
import api from '../../services/api';
import { Food } from '../../components/Food';
import { FoodsContainer } from './styles';
import { useEffect, useState } from 'react';
import { ModalEditFood } from '../../components/ModalEditFood';
import { ModalAddFood } from '../../components/ModalAddFood';

interface FoodProps {
  id: number,
  name: string,
  description: string,
  price: number,
  available: boolean,
  image: string
}

type FoodEditProps = Omit<FoodProps, 'available'>

type FoodAddProps = Omit<FoodProps, 'id' | 'available'>

export function Dashboard() {
  const [foods, setFoods] = useState<FoodProps[]>([]);
  const [editFood, setEditFood] = useState<FoodProps>({} as FoodProps);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  async function componentDidMount() {
    await api.get('/foods')
      .then(response => setFoods(response.data))
  }

  async function handleAddFood({ image, description, name, price }: FoodAddProps) {
    try {
      await api.post('/foods', {
        name: name,
        description: description,
        price: price,
        available: true,
        image: image
      })
        .then(response => setFoods([...foods, response.data]))
    } catch (err) {
      console.log(err);
    }
  }

  async function handleUpdateFood({ id, name, description, image, price }: FoodEditProps) {
    try {
      const foodUpdated = await api.put(`/foods/${id}`, {
        name: name,
        description: description,
        price: price,
        available: true,
        image: image
      });

      const foodsUpdated = foods.map(f => f.id !== foodUpdated.data.id ? f : foodUpdated.data);
      setFoods(foodsUpdated)
    } catch (err) {
      console.log(err);
    }
  }

  async function handleDeleteFood(id: number) {
    try {
      await api.delete(`/foods/${id}`)

      const foodsFiltered = foods.filter(food => food.id !== id);

      setFoods(foodsFiltered)
    } catch (err) {
      console.log(err);
    }
  }

  function toggleModal() {
    setModalOpen(!modalOpen)
  }

  function toggleEditModal() {
    setEditModalOpen(!editModalOpen);
  }

  async function handleEditFood({ id }: FoodProps) {
    await api.get(`/foods/${id}`)
      .then(response => setEditFood(response.data))
      .finally(() => setEditModalOpen(true))
  }

  useEffect(() => {
    componentDidMount()
  }, [])

  return (
    <>
      <Header openModal={toggleModal} />
      <ModalAddFood
        isOpen={modalOpen}
        setIsOpen={toggleModal}
        handleAddFood={handleAddFood}
      />
      <ModalEditFood
        food={editFood}
        isOpen={editModalOpen}
        setIsOpen={toggleEditModal}
        handleUpdateFood={handleUpdateFood}
      />

      <FoodsContainer data-testid="foods-list">
        {foods &&
          foods.map(food => (
            <Food
              key={food.id}
              food={food}
              handleDelete={handleDeleteFood}
              handleEditFood={handleEditFood}
            />
          ))}
      </FoodsContainer>
    </>
  );
};
