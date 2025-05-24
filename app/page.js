"use client";

import { useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import ClientOnly from "./components/ClientOnly.jsx";

function SortableItem({ id, color, name }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="flex flex-col items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md cursor-grab active:cursor-grabbing hover:shadow-lg transition-shadow"
    >
      <div
        className="w-16 h-16 rounded-full mb-2 border-2 border-gray-200 dark:border-gray-600"
        style={{ backgroundColor: color }}
      ></div>
      <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
        {name}
      </span>
    </div>
  );
}

export default function DraggableColorList() {
  const [colors, setColors] = useState([
    { id: "1", name: "Red", color: "#ef4444" },
    { id: "2", name: "Blue", color: "#3b82f6" },
    { id: "3", name: "Green", color: "#10b981" },
    { id: "4", name: "Yellow", color: "#eab308" },
    { id: "5", name: "Purple", color: "#a855f7" },
    { id: "6", name: "Orange", color: "#f97316" },
  ]);

  const [dragInfo, setDragInfo] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  function handleDragStart(event) {
    const { active } = event;
    console.log("Drag started:", {
      activeId: active.id,
      initialCoordinates: active.rect.current.initial,
    });

    setDragInfo({
      activeId: active.id,
      status: "dragging",
      startTime: Date.now(),
    });
  }

  function handleDragMove(event) {
    const { active, over, delta } = event;
    console.log("Drag moving:", {
      activeId: active.id,
      overId: over?.id,
      delta: delta, // x, y movement since drag started
      coordinates: {
        x: active.rect.current.translated?.left,
        y: active.rect.current.translated?.top,
      },
    });
  }

  function handleDragEnd(event) {
    const { active, over, delta } = event;

    console.log("Drag ended:", {
      activeId: active.id,
      overId: over?.id,
      finalDelta: delta,
      finalCoordinates: {
        x: active.rect.current.translated?.left,
        y: active.rect.current.translated?.top,
      },
      boundingRect: active.rect.current.translated,
    });

    if (active.id !== over?.id) {
      setColors((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        console.log("Reordering:", {
          from: oldIndex,
          to: newIndex,
          itemMoved: items[oldIndex].name,
        });

        return arrayMove(items, oldIndex, newIndex);
      });
    }

    setDragInfo({
      activeId: active.id,
      status: "completed",
      finalPosition: over?.id || "dropped outside",
      duration: Date.now() - (dragInfo?.startTime || 0),
    });
  }

  function handleDragCancel() {
    console.log("Drag cancelled");
    setDragInfo({ status: "cancelled" });
  }

  return (
    <div className="max-w-full h-full mx-auto mt-8 p-6">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-gray-200">
        Draggable Colors
      </h2>

      {/* Debug Info */}
      {dragInfo && (
        <div className="mb-4 p-3 bg-gray-100 dark:bg-gray-800 rounded text-sm text-black dark:text-white">
          <strong>Drag Info:</strong> {JSON.stringify(dragInfo, null, 2)}
        </div>
      )}

      <ClientOnly
        fallback={
          <div className="grid grid-cols-3 gap-4">
            {colors.map((color) => (
              <div
                key={color.id}
                className="flex flex-col items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md transition-shadow"
              >
                <div
                  className="w-16 h-16 rounded-full mb-2 border-2 border-gray-200 dark:border-gray-600"
                  style={{ backgroundColor: color.color }}
                ></div>
                <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                  {color.name}
                </span>
              </div>
            ))}
          </div>
        }
      >
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragMove={handleDragMove}
          onDragEnd={handleDragEnd}
          onDragCancel={handleDragCancel}
        >
          <SortableContext items={colors} strategy={rectSortingStrategy}>
            <div className="grid grid-cols-3 gap-4">
              {colors.map((color) => (
                <SortableItem
                  key={color.id}
                  id={color.id}
                  color={color.color}
                  name={color.name}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </ClientOnly>
    </div>
  );
}
