import { useRef } from 'react';
import { FiCheckSquare } from 'react-icons/fi';

import { Form } from './styles';
import { Modal } from '../Modal';
import Input from '../Input';

interface FoodEditProps {
  id: number,
  name: string,
  description: string,
  price: number,
  image: string
}

interface EditProps {
  isOpen: boolean,
  setIsOpen: () => void,
  handleUpdateFood: (data: FoodEditProps) => Promise<void>
  food: {}
}

export const ModalEditFood = ({ isOpen, setIsOpen, handleUpdateFood,food }: EditProps): JSX.Element => {
  const formRef = useRef(null);

  async function handleSubmit(data: FoodEditProps) {
    await handleUpdateFood(data)
    setIsOpen();
  }
  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
      <Form ref={formRef} onSubmit={handleSubmit} initialData={food}>
        <h1>Editar Prato</h1>
        <Input name="image" placeholder="Cole o link aqui" />

        <Input name="name" placeholder="Ex: Moda Italiana" />
        <Input name="price" placeholder="Ex: 19.90" />

        <Input name="description" placeholder="Descrição" />

        <button type="submit" data-testid="edit-food-button">
          <div className="text">Editar Prato</div>
          <div className="icon">
            <FiCheckSquare size={24} />
          </div>
        </button>
      </Form>
    </Modal>
  );
}

