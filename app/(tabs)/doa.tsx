import React, { useMemo, useState, useRef } from 'react';
import { View, FlatList, ActivityIndicator, TouchableOpacity, TextInput, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '@/components/ui/Text';
import { useQuery } from '@tanstack/react-query';
import { getDoaList } from '@/services/doaService';
import { router } from 'expo-router';
import { Search, ChevronRight, Heart, RefreshCcw } from 'lucide-react-native';

export default function DoaScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const flatListRef = useRef<FlatList>(null);

  const { data: doas, isLoading, error, refetch, isRefetching } = useQuery({
    queryKey: ['doas'],
    queryFn: getDoaList,
  });

  const filteredDoas = useMemo(() => {
    setCurrentPage(1); // Reset to first page on search
    if (!doas) return [];
    if (!searchQuery) return doas;
    return doas.filter(d => 
      d.nama.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [doas, searchQuery]);

  const totalPages = Math.ceil(filteredDoas.length / itemsPerPage);
  const paginatedDoas = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredDoas.slice(start, start + itemsPerPage);
  }, [filteredDoas, currentPage]);

  const HeaderComponent = (
    <View className="pt-4 pb-4 bg-background-light dark:bg-background-dark">
      <Text variant="h1" weight="bold" className="text-primary-900 mb-6">
        Daily Doa
      </Text>
      
      <View className="flex-row items-center bg-white dark:bg-surface-dark rounded-2xl px-4 py-1 border border-gray-100 dark:border-gray-800 shadow-sm">
        <Search size={20} color="#926247" />
        <TextInput
          placeholder="Search Doa..."
          placeholderTextColor="#9CA3AF"
          className="flex-1 h-12 ml-2 text-primary-900 dark:text-white"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-background-light dark:bg-background-dark" edges={['top']}>
      <View className="flex-1 px-5">
        {HeaderComponent}
        
        {isLoading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color="#926247" />
          </View>
        ) : error ? (
          <View className="flex-1 items-center justify-center p-6">
            <View className="bg-red-50 dark:bg-red-900/20 p-6 rounded-[32px] items-center w-full border border-red-100 dark:border-red-900/30">
              <RefreshCcw size={48} color="#EF4444" className="mb-4" />
              <Text variant="h3" weight="bold" className="text-red-600 dark:text-red-400 mb-2 text-center">
                Failed to load Doas
              </Text>
              <Text variant="body" className="text-red-500/70 text-center mb-6">
                Please check your internet connection and try again.
              </Text>
              <TouchableOpacity 
                onPress={() => refetch()}
                className="bg-red-500 px-8 py-4 rounded-2xl flex-row items-center"
              >
                <RefreshCcw size={20} color="white" className="mr-2" />
                <Text weight="bold" className="text-white">Try Again</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <FlatList
            ref={flatListRef}
            data={paginatedDoas}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={{ paddingBottom: 20, paddingTop: 10 }}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={isRefetching}
                onRefresh={refetch}
                colors={['#926247']}
                tintColor="#926247"
              />
            }
            renderItem={({ item }) => (
              <TouchableOpacity 
                className="bg-white dark:bg-surface-dark p-5 rounded-[24px] mb-4 border border-gray-100 dark:border-gray-800 shadow-sm flex-row items-center justify-between"
                onPress={() => router.push(`/doa/${item.id}`)}
              >
                <View className="flex-1 mr-4">
                  <View className="flex-row items-center mb-1">
                    <View className="w-8 h-8 bg-primary-50 dark:bg-primary-900/20 rounded-full items-center justify-center mr-3">
                      <Heart size={14} color="#926247" fill="#926247" />
                    </View>
                    <Text variant="body" weight="bold" className="text-primary-900 dark:text-gray-100 flex-1" numberOfLines={1}>
                      {item.nama}
                    </Text>
                  </View>
                  <Text variant="caption" className="text-gray-500" numberOfLines={2}>
                    {item.idn}
                  </Text>
                </View>
                <ChevronRight size={20} color="#9CA3AF" />
              </TouchableOpacity>
            )}
          />
        )}
      </View>

      {/* Pagination Controls */}
      {!isLoading && !error && totalPages > 1 && (
        <View className="flex-row items-center justify-between px-6 py-4 bg-white dark:bg-surface-dark border-t border-gray-100 dark:border-gray-800">
          <TouchableOpacity 
            onPress={() => {
              setCurrentPage(prev => Math.max(1, prev - 1));
              flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
            }}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-xl ${currentPage === 1 ? 'opacity-30' : 'bg-primary-50 dark:bg-primary-900/20'}`}
          >
            <Text weight="bold" className="text-primary-700">Prev</Text>
          </TouchableOpacity>
          
          <Text variant="caption" weight="bold" className="text-primary-900">
            Page {currentPage} of {totalPages}
          </Text>

          <TouchableOpacity 
            onPress={() => {
              setCurrentPage(prev => Math.min(totalPages, prev + 1));
              flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
            }}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded-xl ${currentPage === totalPages ? 'opacity-30' : 'bg-primary-50 dark:bg-primary-900/20'}`}
          >
            <Text weight="bold" className="text-primary-700">Next</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}
