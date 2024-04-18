import React, { useState } from 'react';
import { Button } from "@/common/components/ui/button"
import { useAlert } from "@/context/alert-context"

interface TableCellProps {
  isSelected: boolean;
  onToggle: () => void;
  content: string;
}

const TableCell = ({ isSelected, onToggle, content }: TableCellProps) => {
  return (
    <td
      className={`p-2 border cursor-pointer ${isSelected ? 'bg-blue-200' : 'bg-white'}`}
      onClick={onToggle}
    >
      {content}
    </td>
  );
};

const initialRows = [
  ["Row 1, Cell 1", "Row 1, Cell 2", "Row 1, Cell 3"],
  ["Row 2, Cell 1", "Row 2, Cell 2", "Row 2, Cell 3"],
  // Add more rows as needed
];

const Table: React.FC = () => {
  const [selectedCells, setSelectedCells] = useState<Set<string>>(new Set());

  const toggleCellSelection = (cellId: string) => {
    setSelectedCells(prevSelectedCells => {
      const newSelection = new Set(prevSelectedCells);
      if (newSelection.has(cellId)) {
        newSelection.delete(cellId);
      } else {
        newSelection.add(cellId);
      }
      return newSelection;
    });
  };

  return (
    <table className="border-collapse border">
      <tbody>
        {initialRows.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {row.map((cell, cellIndex) => {
              const cellId = `${rowIndex}-${cellIndex}`;
              return (
                <TableCell
                  key={cellId}
                  content={cell}
                  isSelected={selectedCells.has(cellId)}
                  onToggle={() => toggleCellSelection(cellId)}
                />
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
};


export default function Home() {
  const { showAlert } = useAlert()

  return <>
    <div className="grid gap-4 mt-4 md:grid-cols-2">
      <Button className="text-rich-black text-lg bg-green-400" onClick={() => showAlert("this is success message", "this is success title", "success")}>Click me - success variant</Button>
      <Button className="text-rich-black text-lg bg-red-400" onClick={() => showAlert("this is warning message", "this is warning title", "warning")}>Click me - warning variant</Button>
    </div>
    <p className="text-rich-black flex container mx-auto justify-center m-5 bg-cultured rounded-2xl p-5">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Doloribus in excepturi voluptate harum eos? Nam, dolor reiciendis, totam aliquam, debitis modi iusto accusamus sapiente sequi cupiditate voluptate omnis amet molestiae?
      Sapiente tempora odit vel quia iste veniam excepturi eum, hic quis alias ipsam pariatur nesciunt eveniet, est optio repudiandae minima possimus consectetur unde, ea accusantium quas adipisci? Reprehenderit, quos nisi?
      Provident rerum quas optio labore a repellat laborum voluptate vel illo et accusantium fugiat consectetur impedit eaque deserunt dolores at officiis nisi sed doloribus, facere esse ad vero. Laborum, placeat.
      Quaerat hic ea facere distinctio eligendi nisi deleniti voluptatem nam facilis eaque animi, enim possimus eos inventore corrupti sint porro deserunt cupiditate sunt non numquam, eveniet consectetur. Corporis, non illo.
      Nostrum, minima molestias nisi mollitia quidem alias quisquam animi placeat magni ipsam, adipisci sint assumenda repudiandae, dignissimos eos reiciendis soluta. Esse vitae minima neque laudantium aspernatur veritatis nemo temporibus. Numquam.
      Repellat voluptatibus nihil nam voluptate eius amet repellendus, odit iusto maxime, incidunt quae, ducimus aperiam quidem facilis? Odit iure eos beatae doloremque qui, ipsum, iusto assumenda sint tempore, enim dolores.
      Cumque ut iste commodi nihil explicabo praesentium obcaecati autem odio maxime. Temporibus odio modi quas ea doloribus! Animi quia odit recusandae minus consequuntur nobis, id commodi quam in quaerat dolorem.
      Quaerat officiis totam ratione nemo recusandae, est quia aut unde iste iure optio, deleniti autem sit quos rerum cumque illo dignissimos necessitatibus qui pariatur. Animi enim beatae sed quisquam saepe.
      Illum libero animi fuga autem, aut deserunt dolor, quidem, vero sequi qui perspiciatis in dignissimos odio repellendus numquam consequuntur veniam porro ad reiciendis officiis rerum? Blanditiis, repellendus? Illo, asperiores labore!
      Deserunt, libero? Magni quidem sed numquam pariatur rerum. Commodi voluptatibus quam illum ut inventore est ipsa delectus accusamus, facilis, quod, dolor incidunt autem accusantium. Ipsam accusantium porro facilis fugit iure.</p>

    <div className="flex container justify-center p-4 m-4">
      <img src="/dear.jpeg" alt="dear"></img>
    </div>
  </>
}
