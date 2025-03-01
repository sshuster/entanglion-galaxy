
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AgGridReact } from 'ag-grid-react';
import { ColDef } from 'ag-grid-community';
import { useQuery } from '@tanstack/react-query';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { getPortfolios, getWatchlist, getRecommendations, addStockToPortfolio, addToWatchlist, removeFromWatchlist, searchStocks } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { BarChart2, Search, Plus, Trash2, RefreshCw, TrendingUp, List, DollarSign } from 'lucide-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

const Dashboard = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // State for Add Stock dialog
  const [isAddStockOpen, setIsAddStockOpen] = useState(false);
  const [selectedPortfolioId, setSelectedPortfolioId] = useState<number | null>(null);
  const [newStock, setNewStock] = useState({
    symbol: '',
    shares: 0,
    purchasePrice: 0
  });
  
  // State for search
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  
  // Fetch portfolios
  const { 
    data: portfolios,
    isLoading: isLoadingPortfolios,
    refetch: refetchPortfolios
  } = useQuery({
    queryKey: ['portfolios'],
    queryFn: getPortfolios,
    enabled: !!user,
  });
  
  // Fetch watchlist
  const { 
    data: watchlist,
    isLoading: isLoadingWatchlist,
    refetch: refetchWatchlist
  } = useQuery({
    queryKey: ['watchlist'],
    queryFn: getWatchlist,
    enabled: !!user,
  });
  
  // Fetch recommendations
  const { 
    data: recommendations,
    isLoading: isLoadingRecommendations
  } = useQuery({
    queryKey: ['recommendations'],
    queryFn: getRecommendations,
    enabled: !!user,
  });
  
  // Redirect if not logged in
  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [loading, user, navigate]);
  
  // Handle search
  const handleSearch = async () => {
    if (searchQuery.length < 2) return;
    
    try {
      const results = await searchStocks(searchQuery);
      setSearchResults(results);
    } catch (error) {
      toast({
        title: "Search Failed",
        description: error instanceof Error ? error.message : "Failed to search stocks",
        variant: "destructive",
      });
    }
  };
  
  // Handle add to watchlist
  const handleAddToWatchlist = async (symbol: string) => {
    try {
      await addToWatchlist(symbol);
      refetchWatchlist();
      
      toast({
        title: "Success",
        description: `${symbol} added to watchlist`,
      });
    } catch (error) {
      toast({
        title: "Failed to add to watchlist",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    }
  };
  
  // Handle remove from watchlist
  const handleRemoveFromWatchlist = async (itemId: number) => {
    try {
      await removeFromWatchlist(itemId);
      refetchWatchlist();
      
      toast({
        title: "Success",
        description: "Removed from watchlist",
      });
    } catch (error) {
      toast({
        title: "Failed to remove from watchlist",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    }
  };
  
  // Handle add stock to portfolio
  const handleAddStockToPortfolio = async () => {
    if (!selectedPortfolioId) return;
    
    try {
      await addStockToPortfolio(
        selectedPortfolioId,
        newStock.symbol,
        newStock.shares,
        newStock.purchasePrice
      );
      
      refetchPortfolios();
      setIsAddStockOpen(false);
      setNewStock({ symbol: '', shares: 0, purchasePrice: 0 });
      
      toast({
        title: "Success",
        description: `${newStock.symbol} added to portfolio`,
      });
    } catch (error) {
      toast({
        title: "Failed to add stock",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    }
  };
  
  // Column definitions for portfolio stocks
  const portfolioStocksColumns: ColDef[] = [
    { headerName: "Symbol", field: "symbol", sortable: true, filter: true },
    { headerName: "Shares", field: "shares", sortable: true, filter: true },
    { 
      headerName: "Purchase Price", 
      field: "purchase_price", 
      sortable: true, 
      filter: true,
      valueFormatter: (params) => `$${params.value.toFixed(2)}`
    },
    { 
      headerName: "Current Price", 
      field: "current_price", 
      sortable: true, 
      filter: true,
      valueFormatter: (params) => `$${params.value.toFixed(2)}`
    },
    { 
      headerName: "Current Value", 
      field: "current_value", 
      sortable: true, 
      filter: true,
      valueFormatter: (params) => `$${params.value.toFixed(2)}`
    },
    { 
      headerName: "Gain/Loss", 
      field: "gain_loss", 
      sortable: true, 
      filter: true,
      valueFormatter: (params) => `$${params.value.toFixed(2)}`,
      cellStyle: (params) => {
        if (params.value > 0) return { color: 'green' };
        if (params.value < 0) return { color: 'red' };
        return null;
      }
    },
    { 
      headerName: "Gain/Loss %", 
      field: "gain_loss_percent", 
      sortable: true, 
      filter: true,
      valueFormatter: (params) => `${params.value.toFixed(2)}%`,
      cellStyle: (params) => {
        if (params.value > 0) return { color: 'green' };
        if (params.value < 0) return { color: 'red' };
        return null;
      }
    }
  ];
  
  // Column definitions for watchlist
  const watchlistColumns: ColDef[] = [
    { headerName: "Symbol", field: "symbol", sortable: true, filter: true },
    { headerName: "Company", field: "company_name", sortable: true, filter: true },
    { 
      headerName: "Price", 
      field: "current_price", 
      sortable: true, 
      filter: true,
      valueFormatter: (params) => `$${params.value.toFixed(2)}`
    },
    { 
      headerName: "Change %", 
      field: "change_percent", 
      sortable: true, 
      filter: true,
      valueFormatter: (params) => `${params.value.toFixed(2)}%`,
      cellStyle: (params) => {
        if (params.value > 0) return { color: 'green' };
        if (params.value < 0) return { color: 'red' };
        return null;
      }
    },
    {
      headerName: "Actions",
      field: "id",
      width: 100,
      cellRenderer: (params: any) => (
        <button 
          onClick={() => handleRemoveFromWatchlist(params.value)}
          className="text-red-500 hover:text-red-700"
        >
          <Trash2 size={16} />
        </button>
      )
    }
  ];
  
  // Column definitions for recommendations
  const recommendationsColumns: ColDef[] = [
    { headerName: "Symbol", field: "symbol", sortable: true, filter: true },
    { headerName: "Company", field: "name", sortable: true, filter: true },
    { 
      headerName: "Price", 
      field: "price", 
      sortable: true, 
      filter: true,
      valueFormatter: (params) => `$${params.value.toFixed(2)}`
    },
    { headerName: "Recommendation", field: "recommendation", sortable: true, filter: true },
    { 
      headerName: "Target Price", 
      field: "target_price", 
      sortable: true, 
      filter: true,
      valueFormatter: (params) => `$${params.value.toFixed(2)}`
    },
    { headerName: "Analyst Consensus", field: "analyst_consensus", sortable: true, filter: true },
    { headerName: "Rationale", field: "reason", sortable: true, filter: true },
    {
      headerName: "Actions",
      width: 100,
      cellRenderer: (params: any) => (
        <button 
          onClick={() => handleAddToWatchlist(params.data.symbol)}
          className="text-primary hover:text-primary/80"
        >
          <Plus size={16} />
        </button>
      )
    }
  ];
  
  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[70vh]">
          <RefreshCw className="h-12 w-12 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold tracking-tight">
              Investment Dashboard
            </h1>
            
            <div className="flex items-center space-x-4">
              <div className="relative w-64">
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Search stocks..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
                {searchResults.length > 0 && (
                  <div className="absolute top-full mt-1 w-full bg-white shadow-lg rounded-md border p-2 z-10 max-h-60 overflow-auto">
                    {searchResults.map((result) => (
                      <div 
                        key={result.symbol}
                        className="flex items-center justify-between p-2 hover:bg-muted cursor-pointer rounded-md"
                        onClick={() => {
                          setNewStock({
                            ...newStock,
                            symbol: result.symbol
                          });
                          setSearchResults([]);
                          setSearchQuery('');
                        }}
                      >
                        <div>
                          <div className="font-medium">{result.symbol}</div>
                          <div className="text-sm text-muted-foreground">{result.name}</div>
                        </div>
                        <div className="flex space-x-2">
                          <button 
                            className="p-1 hover:text-primary"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAddToWatchlist(result.symbol);
                              setSearchResults([]);
                              setSearchQuery('');
                            }}
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <Button onClick={handleSearch}>
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
            </div>
          </div>
          
          <Tabs defaultValue="portfolios">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="portfolios">
                <BarChart2 className="h-4 w-4 mr-2" />
                Portfolios
              </TabsTrigger>
              <TabsTrigger value="watchlist">
                <List className="h-4 w-4 mr-2" />
                Watchlist
              </TabsTrigger>
              <TabsTrigger value="recommendations">
                <TrendingUp className="h-4 w-4 mr-2" />
                Recommendations
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="portfolios" className="space-y-6">
              {isLoadingPortfolios ? (
                <div className="flex items-center justify-center h-60">
                  <RefreshCw className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : portfolios && portfolios.length > 0 ? (
                <div className="space-y-6">
                  {portfolios.map((portfolio: any) => (
                    <Card key={portfolio.id}>
                      <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                          <CardTitle>{portfolio.name}</CardTitle>
                          <CardDescription>
                            Total Value: ${portfolio.total_value.toFixed(2)} | 
                            Gain/Loss: <span className={portfolio.total_gain_loss > 0 ? 'text-green-500' : portfolio.total_gain_loss < 0 ? 'text-red-500' : ''}>
                              ${portfolio.total_gain_loss.toFixed(2)} 
                              ({(portfolio.total_gain_loss / portfolio.total_investment * 100).toFixed(2)}%)
                            </span>
                          </CardDescription>
                        </div>
                        
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setSelectedPortfolioId(portfolio.id)}
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              Add Stock
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Add Stock to Portfolio</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                              <div className="space-y-2">
                                <Label htmlFor="symbol">Symbol</Label>
                                <Input
                                  id="symbol"
                                  placeholder="AAPL"
                                  value={newStock.symbol}
                                  onChange={(e) => setNewStock({...newStock, symbol: e.target.value.toUpperCase()})}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="shares">Shares</Label>
                                <Input
                                  id="shares"
                                  type="number"
                                  min="0"
                                  step="0.01"
                                  placeholder="10"
                                  value={newStock.shares || ''}
                                  onChange={(e) => setNewStock({...newStock, shares: parseFloat(e.target.value)})}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="price">Purchase Price</Label>
                                <Input
                                  id="price"
                                  type="number"
                                  min="0"
                                  step="0.01"
                                  placeholder="150.00"
                                  value={newStock.purchasePrice || ''}
                                  onChange={(e) => setNewStock({...newStock, purchasePrice: parseFloat(e.target.value)})}
                                />
                              </div>
                              <Button 
                                className="w-full mt-4"
                                onClick={handleAddStockToPortfolio}
                                disabled={!newStock.symbol || !newStock.shares || !newStock.purchasePrice}
                              >
                                Add to Portfolio
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </CardHeader>
                      <CardContent>
                        <div className="ag-theme-alpine w-full h-[400px]">
                          <AgGridReact
                            rowData={portfolio.stocks}
                            columnDefs={portfolioStocksColumns}
                            pagination={true}
                            paginationPageSize={10}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <DollarSign className="h-16 w-16 text-muted-foreground mb-4" />
                    <h3 className="text-xl font-semibold mb-2">No Portfolios Found</h3>
                    <p className="text-muted-foreground mb-6">
                      Start building your investment portfolio by adding stocks.
                    </p>
                    <Button>Create Portfolio</Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
            
            <TabsContent value="watchlist">
              <Card>
                <CardHeader>
                  <CardTitle>Stocks Watchlist</CardTitle>
                  <CardDescription>
                    Track stocks you're interested in
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoadingWatchlist ? (
                    <div className="flex items-center justify-center h-60">
                      <RefreshCw className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : watchlist && watchlist.length > 0 ? (
                    <div className="ag-theme-alpine w-full h-[400px]">
                      <AgGridReact
                        rowData={watchlist}
                        columnDefs={watchlistColumns}
                        pagination={true}
                        paginationPageSize={10}
                      />
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12">
                      <List className="h-16 w-16 text-muted-foreground mb-4" />
                      <h3 className="text-xl font-semibold mb-2">Your watchlist is empty</h3>
                      <p className="text-muted-foreground mb-6">
                        Use the search bar to find stocks and add them to your watchlist.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="recommendations">
              <Card>
                <CardHeader>
                  <CardTitle>Investment Recommendations</CardTitle>
                  <CardDescription>
                    Expert analysis and investment opportunities
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoadingRecommendations ? (
                    <div className="flex items-center justify-center h-60">
                      <RefreshCw className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : recommendations && recommendations.length > 0 ? (
                    <div className="ag-theme-alpine w-full h-[500px]">
                      <AgGridReact
                        rowData={recommendations}
                        columnDefs={recommendationsColumns}
                        pagination={true}
                        paginationPageSize={10}
                      />
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12">
                      <TrendingUp className="h-16 w-16 text-muted-foreground mb-4" />
                      <h3 className="text-xl font-semibold mb-2">No recommendations available</h3>
                      <p className="text-muted-foreground">
                        Check back later for expert recommendations.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </Layout>
  );
};

export default Dashboard;
