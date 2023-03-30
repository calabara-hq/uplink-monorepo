import '@/styles/editor.css'

const EditorWrap = ({ children }: { children: React.ReactNode }) => {
  return (
    <div
      className="bg-gray-700 rounded-lg cursor-text 
                p-4 md:pr-20 md:pl-20 text-lg"
    >
      {children}
    </div>
  );
};

export default EditorWrap;
