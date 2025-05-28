import { render, screen, fireEvent } from "@testing-library/react";
import CheckoutPage from "./page";
import { useCheckout } from "../../hooks/useCheckout";
import { MemoryRouter } from "react-router-dom";

jest.mock("@/utils/axiosclient", () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    post: jest.fn(),
  },
}));

jest.mock("sweetalert2", () => ({
  fire: jest.fn(),
}));

jest.mock("../../hooks/useCheckout");

const mockSetSelectedAddressId = jest.fn();
const mockSetNewAddress = jest.fn();
const mockSetSaveAddress = jest.fn();
const mockHandleBookOrder = jest.fn();

const renderPage = () => {
  render(
    <MemoryRouter
      initialEntries={[{ pathname: "/checkout", state: { totalPrice: 1234 } }]}
    >
      <CheckoutPage />
    </MemoryRouter>,
  );
};

describe("CheckoutPage", () => {
  beforeEach(() => {
    (useCheckout as jest.Mock).mockReturnValue({
      addresses: [
        {
          id: 1,
          street: "123 Main St",
          city: "Springfield",
          state: "IL",
          postalCode: "62704",
          country: "USA",
        },
      ],
      selectedAddressId: null,
      newAddress: {
        street: "",
        city: "",
        state: "",
        postalCode: "",
        country: "",
      },
      saveAddress: false,
      setSelectedAddressId: mockSetSelectedAddressId,
      setNewAddress: mockSetNewAddress,
      setSaveAddress: mockSetSaveAddress,
      handleBookOrder: mockHandleBookOrder,
    });

    jest.clearAllMocks();
  });

  it("renders total price and address form", () => {
    renderPage();

    expect(
      screen.getByText(
        (_, element) =>
          element?.textContent?.replace(/\s/g, "") === "Total:₹1234",
      ),
    ).toBeInTheDocument();

    expect(screen.getByPlaceholderText("Street")).toBeInTheDocument();
  });

  it("calls handleBookOrder when button is clicked", () => {
    renderPage();
    const button = screen.getByText(/Proceed to Book/i);
    fireEvent.click(button);
    expect(mockHandleBookOrder).toHaveBeenCalled();
  });

  it("updates selected address when radio button is clicked", () => {
    renderPage();
    const radio = screen.getByRole("radio", { name: /123 Main St/i });
    fireEvent.click(radio);
    expect(mockSetSelectedAddressId).toHaveBeenCalledWith(1);
  });

  it("toggles saveAddress checkbox", () => {
    renderPage();
    const checkbox = screen.getByRole("checkbox");
    fireEvent.click(checkbox);
    expect(mockSetSaveAddress).toHaveBeenCalledWith(true);
  });
});
