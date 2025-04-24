
// src/components/FileMenuDropdown.tsx
import { FC, ReactNode } from "react";
import {
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarSeparator,
} from "@/components/ui/menubar";
import { useProject } from "@/contexts/project";
import { supabase } from "@/integrations/supabase/client";
import { Project } from "@/utils/slideTypes";

export const FileMenuDropdown: FC<{ children?: ReactNode }> = ({ children }) => {
  const { project, setProject } = useProject();

  const handleNew = () => {
    setProject({ /* your default empty project shape */ });
  };

  const handleImport = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
      const text = await file.text();
      setProject(JSON.parse(text));
    };
    input.click();
  };

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(project, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = (project.title || "project") + ".json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSaveLocal = () => {
    localStorage.setItem("instructivProject", JSON.stringify(project));
    alert("Project saved locally");
  };

  const handleOpenLocal = () => {
    const saved = localStorage.getItem("instructivProject");
    if (saved) setProject(JSON.parse(saved));
    else alert("No local project found");
  };

  const handleSaveCloud = async () => {
    try {
      const title = project.title || prompt("Project name:", "Untitled") || "Untitled";
      if (!project.id) {
        // insert new
        const { data, error } = await supabase
          .from("projects")
          .insert({ title, data: project as any })
          .select("id, data")
          .single();
        if (error) throw error;
        // Use a more robust type assertion with proper type checking
        if (data && data.data) {
          const projectData = data.data as unknown;
          // Basic validation to ensure it matches Project structure
          if (
            typeof projectData === 'object' && 
            projectData !== null && 
            'id' in projectData && 
            'title' in projectData &&
            'scenes' in projectData
          ) {
            setProject(projectData as Project);
          } else {
            throw new Error("Invalid project data format received from server");
          }
        }
      } else {
        // update existing
        const { error } = await supabase
          .from("projects")
          .update({ data: project as any, title })
          .eq("id", project.id);
        if (error) throw error;
      }
      alert("Saved to cloud");
    } catch (err: any) {
      alert("Cloud save error: " + err.message);
    }
  };

  const handleOpenCloud = async () => {
    try {
      const { data: list, error: listErr } = await supabase
        .from("projects")
        .select("id, title")
        .order("updated_at", { ascending: false });
      if (listErr) throw listErr;
      const choices = list.map((p, i) => `${i + 1}. ${p.title}`).join("\n");
      const pick = parseInt(prompt(`Open which project?\n${choices}`) || "", 10) - 1;
      if (isNaN(pick) || pick < 0 || pick >= list.length) return;
      const { data, error: getErr } = await supabase
        .from("projects")
        .select("data")
        .eq("id", list[pick].id)
        .single();
      if (getErr) throw getErr;
      
      // Use a more robust type assertion with proper type checking
      if (data && data.data) {
        const projectData = data.data as unknown;
        // Basic validation to ensure it matches Project structure
        if (
          typeof projectData === 'object' && 
          projectData !== null && 
          'id' in projectData && 
          'title' in projectData &&
          'scenes' in projectData
        ) {
          setProject(projectData as Project);
        } else {
          throw new Error("Invalid project data format received from server");
        }
      }
    } catch (err: any) {
      alert("Cloud open error: " + err.message);
    }
  };

  return (
    <MenubarMenu>
      <MenubarTrigger>File</MenubarTrigger>
      <MenubarContent>
        <MenubarItem onSelect={handleNew}>New</MenubarItem>
        <MenubarItem onSelect={handleImport}>Import…</MenubarItem>
        <MenubarItem onSelect={handleExport}>Export…</MenubarItem>
        <MenubarSeparator />
        <MenubarItem onSelect={handleSaveLocal}>Save Local</MenubarItem>
        <MenubarItem onSelect={handleOpenLocal}>Open Local</MenubarItem>
        <MenubarSeparator />
        <MenubarItem onSelect={handleSaveCloud}>Save to Cloud</MenubarItem>
        <MenubarItem onSelect={handleOpenCloud}>Open from Cloud</MenubarItem>
        {children}
      </MenubarContent>
    </MenubarMenu>
  );
};

