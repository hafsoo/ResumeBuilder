import React from "react";
import ClassicTemplate from "../components/templates/ClassicTemplate";
import ModernTemplate from "../components/templates/ModernTemplate";
import MinimalTemplate from "../components/templates/MinimalTemplate";

const ResumePreviewContent = ({ templateId = "modern", ...props }) => {
  if (templateId === "classic") return <ClassicTemplate {...props} />;
  if (templateId === "minimal") return <MinimalTemplate {...props} />;
  return <ModernTemplate {...props} />;
};

export default ResumePreviewContent;
