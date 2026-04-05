"use client";

import {
  closestCenter,
  DndContext,
  type DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useForm } from "@tanstack/react-form";
import {
  Code,
  GripVertical,
  Heading,
  Image as ImageIcon,
  Loader2,
  Save,
  Trash2,
  Type,
  Upload,
} from "lucide-react";
import { use, useRef, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { uploadImageAction } from "@/lib/actions/upload-actions";
import { compressImage } from "@/lib/compress-image";
import type { BlogSection } from "@/lib/dal/blogs";
import { useUpdateSection } from "@/lib/mutations/blog-mutations";

const _sectionSchema = z.object({
  id: z.string(),
  blog_id: z.string(),
  type: z.enum(["title", "image", "code", "paragraph"]),
  content: z.string().min(1, "Content is required"),
  sub_title: z.string().nullable(),
  order_index: z.number().int(),
});

function SortableItem({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative transition-all duration-300 ${isDragging ? "shadow-2xl opacity-80 scale-[1.02]" : ""}`}
    >
      <div
        className="absolute left-2 top-1/2 -translate-y-1/2 cursor-grab active:cursor-grabbing text-muted-foreground/30 hover:text-white p-2 z-20 transition-colors"
        {...attributes}
        {...listeners}
        suppressHydrationWarning
      >
        <GripVertical className="h-6 w-6" />
      </div>
      {children}
    </div>
  );
}

export default function SectionEditor({
  promise,
  blogIdPromise,
}: {
  promise: Promise<BlogSection[]>;
  blogIdPromise: Promise<string>;
}) {
  const initialData = use(promise);
  const blogId = use(blogIdPromise);

  const { mutate, isPending } = useUpdateSection(blogId);

  const form = useForm({
    defaultValues: {
      sections:
        initialData.length > 0
          ? initialData.map((s, i) => ({ ...s, order_index: i }))
          : [],
    },

    onSubmit: async ({ value }) => {
      mutate(value.sections);
    },
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  if (!blogId) {
    return (
      <div className="text-destructive font-mono mb-10">
        Cannot load blog ID
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className="flex flex-col gap-6"
    >
      <form.Field name="sections">
        {(field) => {
          const sections = field.state.value;

          const handleDragEnd = (event: DragEndEvent) => {
            const { active, over } = event;
            if (over && active.id !== over.id) {
              const oldIndex = sections.findIndex((s) => s.id === active.id);
              const newIndex = sections.findIndex((s) => s.id === over.id);
              const newArray = arrayMove(sections, oldIndex, newIndex).map(
                (s, i) => ({ ...s, order_index: i }),
              );
              field.handleChange(newArray);
            }
          };

          const addSection = (
            type: "title" | "image" | "code" | "paragraph",
          ) => {
            field.pushValue({
              id: `${crypto.randomUUID()}`,
              blog_id: blogId,
              type,
              content: "",
              sub_title: null,
              order_index: sections.length,
            });
          };

          // const removeSection = (index: number) => {
          //   const newSections = sections
          //     .filter((_, i) => i !== index)
          //     .map((s, i) => ({ ...s, order_index: i }));
          //   field.handleChange(newSections);
          //   mutation.mutate(newSections);
          // };
          const removeSection = (index: number) => {
            field.removeValue(index);
          };

          return (
            <div className="flex flex-col gap-8">
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={sections.map((s) => s.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="flex flex-col gap-6">
                    {sections.length === 0 && (
                      <div className="p-16 border-2 border-dashed border-border/20 rounded-3xl text-center text-muted-foreground flex flex-col items-center gap-6 bg-card/5 backdrop-blur-sm">
                        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                          <Type className="h-8 w-8 text-primary/80" />
                        </div>
                        <p className="text-lg">
                          The sequence is void. Begin conceptualizing.
                        </p>
                      </div>
                    )}

                    {sections.map((sec, idx) => (
                      <SortableItem key={sec.id} id={sec.id}>
                        <Card className="pl-14 pr-6 py-6 border-border/20 bg-[#0c0c0e]/80 backdrop-blur-xl shadow-xl hover:border-primary/30 transition-colors relative group overflow-visible">
                          {/* UI mapping for fields */}
                          <div className="absolute right-4 top-4 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive/50 hover:text-destructive hover:bg-destructive/10"
                              onClick={() => removeSection(idx)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>

                          <div className="flex flex-col gap-4 w-full pt-2">
                            <div className="flex items-center gap-2 mb-2">
                              <BadgeVariantForType type={sec.type} />
                            </div>

                            {sec.type === "paragraph" && (
                              <form.Field name={`sections[${idx}].sub_title`}>
                                {(subField) => (
                                  <Input
                                    className="bg-background/20 border-border/10 text-base focus-visible:ring-primary/40 placeholder:text-muted-foreground/50 h-10"
                                    placeholder="Optional Sub-title (e.g. Overview)"
                                    value={subField.state.value || ""}
                                    onChange={(e) =>
                                      subField.handleChange(e.target.value)
                                    }
                                  />
                                )}
                              </form.Field>
                            )}

                            <form.Field
                              name={`sections[${idx}].content`}
                              validators={{
                                onChange: z.string().min(1, "Required"),
                              }}
                            >
                              {(contentField) => (
                                <div className="flex flex-col gap-2 w-full">
                                  {sec.type === "paragraph" ||
                                  sec.type === "code" ? (
                                    <Textarea
                                      className="min-h-[140px] bg-background/20 border-border/10 font-medium resize-y focus-visible:ring-primary/40 placeholder:text-muted-foreground/40 leading-relaxed"
                                      placeholder={
                                        sec.type === "code"
                                          ? "Paste your syntax..."
                                          : "Expand your philosophical thoughts..."
                                      }
                                      value={contentField.state.value}
                                      onChange={(e) =>
                                        contentField.handleChange(
                                          e.target.value,
                                        )
                                      }
                                    />
                                  ) : sec.type === "image" ? (
                                    <ImageUploadField
                                      value={contentField.state.value}
                                      onChange={(val) =>
                                        contentField.handleChange(val)
                                      }
                                    />
                                  ) : (
                                    <Input
                                      className="bg-background/20 border-border/10 text-xl font-bold h-12 focus-visible:ring-primary/40"
                                      placeholder="Structure Heading Title..."
                                      value={contentField.state.value}
                                      onChange={(e) =>
                                        contentField.handleChange(
                                          e.target.value,
                                        )
                                      }
                                    />
                                  )}
                                  {contentField.state.meta.errors ? (
                                    <span className="text-xs text-destructive flex items-center mt-1 px-1">
                                      {contentField.state.meta.errors.join(
                                        ", ",
                                      )}
                                    </span>
                                  ) : null}
                                </div>
                              )}
                            </form.Field>
                          </div>
                        </Card>
                      </SortableItem>
                    ))}
                  </div>
                </SortableContext>
              </DndContext>

              <div className="flex items-center gap-3 flex-wrap bg-card/20 p-2 rounded-2xl border border-border/20 backdrop-blur-md self-start mt-4 shadow-lg shadow-black/20">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => addSection("title")}
                  className="gap-2 hover:bg-blue-500/10 hover:text-blue-400"
                >
                  <Heading className="h-4 w-4" /> Title Block
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => addSection("paragraph")}
                  className="gap-2 hover:bg-green-500/10 hover:text-green-400"
                >
                  <Type className="h-4 w-4" /> Paragraph Block
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => addSection("image")}
                  className="gap-2 hover:bg-purple-500/10 hover:text-purple-400"
                >
                  <ImageIcon className="h-4 w-4" /> Image Frame
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => addSection("code")}
                  className="gap-2 hover:bg-yellow-500/10 hover:text-yellow-400"
                >
                  <Code className="h-4 w-4" /> Code Syntax
                </Button>
              </div>
            </div>
          );
        }}
      </form.Field>

      <form.Subscribe selector={(state) => [state.isDirty, state.canSubmit]}>
        {([isDirty, canSubmit]) => {
          if (!isDirty) return null;

          return (
            <div className="fixed bottom-10 right-10 z-50 animate-in fade-in zoom-in duration-300">
              <Button
                type="submit"
                size="lg"
                className="rounded-full h-16 px-10 shadow-2xl shadow-primary/30 bg-primary leading-none tracking-wider font-extrabold gap-3 hover:scale-105 transition-all text-sm group"
                disabled={isPending || !canSubmit}
              >
                {isPending ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    SAVE
                    <Save className="h-5 w-5 group-hover:rotate-6 transition-transform" />
                  </>
                )}
              </Button>
            </div>
          );
        }}
      </form.Subscribe>
    </form>
  );
}

function ImageUploadField({
  value,
  onChange,
}: {
  value: string;
  onChange: (val: string) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const compressed = await compressImage(file);
      const fd = new FormData();
      fd.append("file", compressed);
      const res = await uploadImageAction(fd);
      if (res.success) {
        onChange(res.url);
        toast.success("Image uploaded");
      } else {
        toast.error("Upload failed", { description: res.error });
      }
    } catch (err) {
      toast.error("Upload failed", { description: String(err) });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col gap-3 w-full">
      {value && (
        <div className="relative w-full aspect-[16/9] rounded-lg overflow-hidden border border-border/20 bg-muted/10">
          <img
            src={value}
            alt="Section visual"
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <div className="flex gap-2">
        <Input
          className="bg-background/20 border-border/10 h-10 focus-visible:ring-primary/40 flex-1"
          placeholder="Image URL (or upload below)"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleUpload}
        />
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="h-10 w-10 shrink-0 border-border/20 hover:bg-purple-500/10 hover:text-purple-400 hover:border-purple-400/40 transition-all"
          disabled={uploading}
          onClick={() => fileRef.current?.click()}
        >
          {uploading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Upload className="w-4 h-4" />
          )}
        </Button>
      </div>
    </div>
  );
}

function BadgeVariantForType({ type }: { type: string }) {
  switch (type) {
    case "title":
      return (
        <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-blue-400 bg-blue-400/10 border border-blue-400/20 px-2 py-1 rounded-sm">
          Title Element
        </span>
      );
    case "paragraph":
      return (
        <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-green-400 bg-green-400/10 border border-green-400/20 px-2 py-1 rounded-sm">
          Paragraph Element
        </span>
      );
    case "code":
      return (
        <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-yellow-500 bg-yellow-500/10 border border-yellow-500/20 px-2 py-1 rounded-sm">
          Syntax Element
        </span>
      );
    case "image":
      return (
        <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-purple-400 bg-purple-400/10 border border-purple-400/20 px-2 py-1 rounded-sm">
          Visual Element
        </span>
      );
    default:
      return null;
  }
}
