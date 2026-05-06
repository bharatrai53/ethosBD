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

export default function OutreachEngine() {
  const [showUpload, setShowUpload] = useState(false);

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

  return (
    <div style={{ fontFamily: T.mono, background: T.bgMain, minHeight: "100vh", color: T.textPrimary, padding: 0 }}>
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

      {bulkGenerating && <ProgressBar bulkProgress={bulkProgress} />}

      <div style={{ display: "flex", height: "calc(100vh - 53px)" }}>
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
    </div>
  );
}
