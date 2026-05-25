import { Reply, Share2, Trash, Trash2 } from "lucide-react-native";
import React from "react";
import { Modal, Text, TouchableOpacity, View } from "react-native";

type Props = {
  visible: boolean;
  onClose: () => void;
  onReply: () => void;
  onShare: () => void;
  onDeleteForYou: () => void;
  onDeleteForAll: () => void;
};

export default function MessageActionsMenu({
  visible,
  onClose,
  onReply,
  onShare,
  onDeleteForYou,
  onDeleteForAll,
}: Props) {
  return (
    <Modal transparent visible={visible} animationType="fade">
      {/* Fundo escuro */}
      <TouchableOpacity
        activeOpacity={1}
        onPress={onClose}
        className="flex-1 bg-black/60"
      >
        {/* Caixa do menu */}
        <View className="absolute bottom-28 left-4 right-4 bg-[#111] rounded-2xl p-3 mx-4 border border-gray-800">
          
          {/* Responder */}
          <TouchableOpacity
            className="flex-row items-center py-3 px-2"
            onPress={onReply}
          >
            <Reply size={20} color="#fff" />
            <Text className="text-white text-base ml-3">Responder</Text>
          </TouchableOpacity>

          {/* Compartilhar */}
          <TouchableOpacity
            className="flex-row items-center py-3 px-2"
            onPress={onShare}
          >
            <Share2 size={20} color="#fff" />
            <Text className="text-white text-base ml-3">Compartilhar</Text>
          </TouchableOpacity>

          {/* Apagar pra você */}
          <TouchableOpacity
            className="flex-row items-center py-3 px-2"
            onPress={onDeleteForYou}
          >
            <Trash2 size={20} color="#fff" />
            <Text className="text-white text-base ml-3">Apagar pra você</Text>
          </TouchableOpacity>

          {/* Apagar Mensagem (p/ todos) */}
          <TouchableOpacity
            className="flex-row items-center py-3 px-2"
            onPress={onDeleteForAll}
          >
            <Trash size={20} color="#ff4040" />
            <Text className="text-red-500 text-base ml-3">Apagar Mensagem</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}
