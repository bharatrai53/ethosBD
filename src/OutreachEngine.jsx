import { useState } from "react";
import { T } from "./constants/theme";
import { useOutreach } from "./hooks/useOutreach";
import GlobalStyles from "./components/GlobalStyles";
import Header from "./components/Header";
import ProgressBar from "./components/ProgressBar";
import ContactList from "./components/ContactList";
import ContactHeader from "./components/ContactHeader";
import TouchTabs from "./components/TouchTabs";
import MessageArea from "./components/MessageArea";
import BottomNav from "./components/BottomNav";
import ContactUploadModal from "./components/ContactUploadModal";
import PipelineView from "./components/PipelineView";

const NAV_TABS = [
  { id: "compose",  label: "✉ Compose" },
  { id: "pipeline", label: "◈ Pipeline" },
];

export default function OutreachEngine() {
  const [showUpload, setShowUpload] = useState(false);
  const [view, setView] = useState("compose");

  const {
    contacts,
    senderName, updateSenderName,
    selected, setSelected,
    touchType, setTouchType,
    messages, loading,
    statuses, getStatus, setContactStatus,
    filter, setFilter,
    copied,
    bulkGenerating, bulkProgress,
    contact, filteredContacts,
    currentKey, currentMsg, isLoading,
    generatedCount,
    generate, generateAll, stopBulk,
    copyText, deleteMessage, editMessage,
    importContacts,
    exportCSV,
  } = useOutreach();

  const contactIdx = contacts.indexOf(contact);

  function openInCompose(idx) {
    setSelected(idx);
    setView("compose");
  }

  return (
    <div style={{ fontFamily: T.mono, background: T.bgMain, minHeight: "100vh", color: T.textPrimary, padding: 0, display: "flex", flexDirection: "column" }}>
      <GlobalStyles />

      {showUpload && (
        <ContactUploadModal
          onImport={importContacts}
          onClose={() => setShowUpload(false)}
        />
      )}

      <Header
        generatedCount={generatedCount}
        bulkGenerating={bulkGenerating}
        bulkProgress={bulkProgress}
        onGenerateAll={generateAll}
        onStop={stopBulk}
        onExportCSV={exportCSV}
        onUpload={() => setShowUpload(true)}
        senderName={senderName}
        onSenderChange={updateSenderName}
      />

      {/* View switcher */}
      <div style={{ display: "flex", alignItems: "center", gap: 2, padding: "0 20px", borderBottom: `1px solid ${T.border}`, background: T.bgPanel }}>
        {NAV_TABS.map(tab => {
          const isActive = view === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setView(tab.id)}
              style={{ padding: "10px 18px", fontSize: 12, fontFamily: T.mono, fontWeight: isActive ? 600 : 400, color: isActive ? T.accent : T.textMuted, background: "transparent", border: "none", borderBottom: isActive ? `2px solid ${T.accent}` : "2px solid transparent", cursor: "pointer", transition: "all 0.12s" }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {bulkGenerating && <ProgressBar bulkProgress={bulkProgress} />}

      {view === "pipeline" ? (
        <PipelineView
          contacts={contacts}
          statuses={statuses}
          setContactStatus={setContactStatus}
          onOpenCompose={openInCompose}
        />
      ) : (
        <div style={{ display: "flex", flex: 1, overflow: "hidden", height: "calc(100vh - 101px)" }}>
          <ContactList
            contacts={contacts}
            filteredContacts={filteredContacts}
            selected={selected}
            onSelect={setSelected}
            filter={filter}
            onFilter={setFilter}
            messages={messages}
            statuses={statuses}
          />

          <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
            <ContactHeader
              contact={contact}
              contactIdx={contactIdx}
              status={getStatus(contactIdx)}
              onStatusChange={setContactStatus}
            />

            <TouchTabs
              touchType={touchType}
              onSelect={setTouchType}
              messages={messages}
              contactIdx={contactIdx}
            />

            <MessageArea
              contact={contact}
              touchType={touchType}
              onTouchType={setTouchType}
              currentMsg={currentMsg}
              currentKey={currentKey}
              isLoading={isLoading}
              onGenerate={() => generate(selected, touchType)}
              onEdit={editMessage}
              onDelete={deleteMessage}
              onCopy={copyText}
              copied={copied}
            />

            <BottomNav
              selected={selected}
              onSelect={setSelected}
              total={contacts.length}
            />
          </div>
        </div>
      )}
    </div>
  );
}
